import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Permissions from '../utils/permissions'
import { CSVReader } from 'react-papaparse'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { faCircleNotch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const CREATE_USER_MUTATION = gql`
  mutation CREATE_USER_MUTATION(
    $firstName: String!
    $lastName: String!
    $displayName: String
    $gender: String
    $birthday: Date
    $profileImageUrl: String
    $permissions: Int!
    $emailAddress: String!
  ) {
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
  currentlyImportingUsers: boolean
  successCount: any
  failedImportArray: any
  fileInput: any
}

export default class CSVDataImport extends React.Component<CSVDataImportProps, CSVDataImportState> {
  constructor(props: CSVDataImportProps) {
    super(props)

    this.state = {
      modifiedState: { permissions: props.user.permissions },
      importing: props.isImporting || false,
      successMessage: '',
      loadingMessage: '',
      valid: false,
      importedCSVData: undefined,
      errorMessage: '',
      currentlyImportingUsers: false,
      successCount: [],
      failedImportArray: [],
      fileInput: React.createRef()
    }
  }

  renderCSVUsersImportList = () => {
    return this.state.importedCSVData.data.map((item, i) => {
      let importUserStatusIcon
      let iconClassName
      if (this.state.currentlyImportingUsers) {
        importUserStatusIcon = faCircleNotch
        iconClassName = 'fa-spin text-warning'
        if (this.state.successCount.length >= i) {
          importUserStatusIcon = faCheckCircle
          iconClassName = 'text-success'
        } else if (this.state.failedImportArray.length >= i) {
          importUserStatusIcon = faTimesCircle
          iconClassName = 'text-danger'
        }
      } else if (!this.state.currentlyImportingUsers && this.state.successCount.length >= i) {
        importUserStatusIcon = faCheckCircle
        iconClassName = 'text-success'
      } else {
        importUserStatusIcon = faCircle
        iconClassName = 'text-muted'
      }

      if (item[0] !== 'Email') {
        return (
          <div style={{ margin: '10px 0', display: 'flex' }} key={i}>
            <FontAwesomeIcon icon={importUserStatusIcon} className={iconClassName} />
            <div style={{ marginLeft: '10px' }}>{`${item[0]}, ${item[1]}, ${item[2]}, ${item[3]}`}</div>
          </div>
        )
      }
    })
  }

  handleReadCSV = (data) => {
    this.setState({
      importedCSVData: data
    })
  }

  handleOnError = (err) => {
    console.error(err)
  }

  handleImportOffer = () => {
    this.state.fileInput.current.click()
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
            Please upload your CSV file in the following format: <br /> Email, First Name, Last Name, Permissions,
            Gender (optional), Display Name (optional), Birthday (optional) (mm/dd/yyyy)
          </div>
          {this.state.importedCSVData && (
            <div style={{ padding: '20px', maxHeight: '350px', overflowY: 'auto' }}>
              {this.renderCSVUsersImportList()}
            </div>
          )}

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
        <div style={{ padding: '1.25rem 1.25rem' }} className="card-footer w-100">
          <div className="btn-toolbar">
            {this.state.importing && (
              <div
                className="ml-auto"
                style={{
                  gridTemplateColumns: '3fr 1fr 1fr',
                  display: 'grid',
                  width: '100%'
                }}>
                <Mutation mutation={CREATE_USER_MUTATION}>
                  {(createUser: (payload: any) => Promise<any>, { loading }) => {
                    return (
                      <>
                        <CSVReader
                          onFileLoaded={this.handleReadCSV}
                          inputRef={this.state.fileInput}
                          style={{ display: 'none' }}
                          onError={this.handleOnError}
                          configOptions={{ skipEmptyLines: 'greedy' }}
                        />
                        <button
                          disabled={this.state.importedCSVData}
                          className="btn btn-outline-success"
                          style={{ width: '40%' }}
                          onClick={this.handleImportOffer}>
                          Upload CSV file
                        </button>
                        <button
                          disabled={this.state.currentlyImportingUsers}
                          style={{ width: '90%', justifySelf: 'end' }}
                          className="btn btn-secondary mr-2"
                          onClick={() => {
                            this.setState({ importing: false, modifiedState: {} })
                            if (this.props.onCancel) {
                              this.props.onCancel()
                            }
                          }}>
                          <i className="fa fa-fw fa-times" /> Cancel
                        </button>
                        <button
                          style={{ width: '90%', justifySelf: 'end' }}
                          disabled={loading || this.state.importedCSVData === undefined}
                          className="btn btn-outline-success"
                          type="button"
                          onClick={async () => {
                            const successCount = []
                            let totalUsersToImport
                            const failedImportToStateArray = []
                            if (this.state.importedCSVData) {
                              const CSVData = this.state.importedCSVData.data
                              totalUsersToImport = CSVData.length - 1
                              this.setState({
                                loadingMessage: `Please wait while we import your users. ${successCount.length} of ${totalUsersToImport} users imported`
                              })

                              for (let i = 0; i < CSVData.length; i++) {
                                const item = CSVData[i]
                                this.setState({ currentlyImportingUsers: true })
                                if (item[0] !== 'Email') {
                                  const payload = {
                                    emailAddress: item[0],
                                    firstName: item[1],
                                    lastName: item[2],
                                    permissions:
                                      item[3] === 'User' ? permissionOptions[0].value : permissionOptions[1].value,
                                    gender: item[4],
                                    displayName: item[5],
                                    birthday: item[6]
                                  }
                                  try {
                                    const result = await createUser({ variables: payload })

                                    successCount.push(result.data.createUser.success)

                                    this.setState({
                                      successCount: successCount,
                                      loadingMessage: `Please wait while we import your users. ${successCount.length} of ${totalUsersToImport} users imported`
                                    })

                                    if (successCount.length === totalUsersToImport) {
                                      this.setState({
                                        successMessage: `Users have been successfully imported!`,
                                        loadingMessage: '',
                                        currentlyImportingUsers: false
                                      })
                                      setTimeout(() => {
                                        this.props.onSave()
                                      }, 2000)
                                    }
                                  } catch (err) {
                                    if (err) {
                                      failedImportToStateArray.push(false)
                                    }
                                    const errMessage = err.message.substring(err.message.indexOf(':') + 1)
                                    this.setState({
                                      errorMessage: `${errMessage}`,
                                      loadingMessage: '',
                                      failedImportArray: failedImportToStateArray,
                                      currentlyImportingUsers: false
                                    })
                                    this.props.refetch()
                                  }
                                }
                              }
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
