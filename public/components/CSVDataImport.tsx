import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Permissions from '../utils/permissions'
import { CSVReader } from 'react-papaparse'

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION($firstName: String!, $lastName: String!, $displayName: String, $gender: String, $birthday: Date, $profileImageUrl: String, $permissions: Int!, $emailAddress: String!) {
    createUser(
      data: {
        firstName: $firstName
        lastName: $lastName
        displayName: $displayName
        gender: $gender
        birthday: $birthday
        profileImageUrl: $profileImageUrl
        emailAddress: $emailAddress
        permissions: $permissions
      }
    ) {
      success
      message
    }
  }
`
export interface CSVDataImportProps {
  showPermissionSelector?: boolean
  onSave?: () => void
  onCancel?: () => void
  isImporting?: boolean
  user: {
    permissions: number
  }
  refetch?: () => void
}

export interface CSVDataImportState {
  modifiedState: any
  importing: boolean
  successMessage: string
  loadingMessage: string
  valid: boolean
  importedCSVData: any
  errorMessage: string
}

export default class CSVDataImport extends React.Component<CSVDataImportProps, CSVDataImportState> {
  constructor(props: CSVDataImportProps) {
    super(props)
    this.fileInput = React.createRef()

    this.state = {
      modifiedState: { permissions: props.user.permissions },
      importing: props.isImporting || false,
      successMessage: '',
      loadingMessage: '',
      valid: false,
      importedCSVData: undefined,
      errorMessage: ''
    }
  }

  handleReadCSV = (data) => {
    this.setState({
      importedCSVData: data
    })
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleImportOffer = () => {
    this.fileInput.current.click()
    this.setState({ errorMessage: '' })
  }

  render() {
    const permissionOptions = [
      {
        label: 'User',
        value: Permissions.USER
      },
      {
        label: 'Administrator',
        value: Permissions.ADMIN
      }
    ]
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Upload your CSV file containing the list of users</h5>
        </div>
        <form>
          <div className="form-group" style={{ padding: '20px' }}>
            Please upload your CSV file in the format of: <br /> Email, First Name, Last Name, Permissions, Gender (optional), Display Name (optional), Birthday (optional) (mm/dd/yyyy)
          </div>

          {this.state.loadingMessage && (
            <div className="alert alert-warning" style={{ width: '60%', margin: '20px auto' }}>
              {this.state.loadingMessage}
            </div>
          )}
          {this.state.successMessage && (
            <div className="alert alert-success" style={{ width: '60%', margin: '20px auto' }}>
              {this.state.successMessage}
            </div>
          )}
          {this.state.errorMessage && (
            <div className="alert alert-danger" style={{ width: '60%', margin: '20px auto' }}>
              {this.state.errorMessage}
            </div>
          )}
        </form>
        <div className="card-footer w-100">
          <div className="btn-toolbar">
            {this.state.importing && (
              <div className="ml-auto" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <button
                  className="btn btn-secondary mr-2"
                  onClick={() => {
                    this.setState({ importing: false, modifiedState: {} })
                    if (this.props.onCancel) {
                      this.props.onCancel()
                    }
                  }}>
                  <i className="fa fa-fw fa-times" /> Cancel
                </button>
                <Mutation mutation={CREATE_USER_MUTATION}>
                  {(createUser: (payload: any) => Promise<any>, { loading }) => {
                    return (
                      <>
                        <CSVReader onFileLoaded={this.handleReadCSV} inputRef={this.fileInput} style={{ display: 'none' }} onError={this.handleOnError} configOptions={{ skipEmptyLines: 'greedy' }} />
                        <button className="btn btn-outline-success" style={{ width: 'auto' }} onClick={this.handleImportOffer}>
                          Upload CSV file
                        </button>
                        <button
                          disabled={loading}
                          className="btn btn-outline-success"
                          type="button"
                          onClick={() => {
                            let successCount = []
                            let successfulImports
                            let TotalUsersToImport
                            this.setState({ loadingMessage: 'Please wait while we import your users' })
                            if (this.state.importedCSVData) {
                              const CSVData = this.state.importedCSVData.data
                              CSVData.map((item, i) => {
                                if (item[0] === 'Email') {
                                  return
                                }
                                let payload = {
                                  emailAddress: item[0],
                                  firstName: item[1],
                                  lastName: item[2],
                                  permissions: item[3] === 'User' ? permissionOptions[0].value : permissionOptions[1].value,
                                  gender: item[4],
                                  displayName: item[5],
                                  birthday: item[6]
                                }
                                createUser({ variables: payload })
                                  .then((result) => {
                                    successCount.push(result.data.createUser.success)
                                    successfulImports = successCount.length
                                    TotalUsersToImport = CSVData.length - 1

                                    if (successCount.length === CSVData.length - 1) {
                                      this.setState({
                                        successMessage: `Users have been successfully imported! - Number of users imported successfully: (${successfulImports} out of ${TotalUsersToImport})`,
                                        loadingMessage: ''
                                      })
                                      setTimeout(() => {
                                        this.props.onSave()
                                      }, 2000)
                                    }
                                  })
                                  .catch((err) => {
                                    let errMessage = err.message.substring(err.message.indexOf(':') + 1)
                                    this.setState({
                                      errorMessage: `${errMessage} - Number of users imported successfully: (${successfulImports} out of ${TotalUsersToImport})`,
                                      loadingMessage: ''
                                    })
                                  })
                              })
                            } else {
                              this.setState({ loadingMessage: '' })
                              this.setState({ errorMessage: 'Please upload a valid .csv file', loadingMessage: '' })
                            }
                          }}>
                          Import users
                        </button>
                      </>
                    )
                  }}
                </Mutation>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
