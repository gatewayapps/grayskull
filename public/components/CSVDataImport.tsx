import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import FormValidation, { FormValidationRule } from './FormValidation'
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
}

export interface CSVDataImportState {
  modifiedState: any
  importing: boolean
  message: string
  valid: boolean
  importedCSVData: any
}

export default class CSVDataImport extends React.Component<CSVDataImportProps, CSVDataImportState> {
  constructor(props: CSVDataImportProps) {
    super(props)
    this.fileInput = React.createRef()

    this.state = {
      modifiedState: { permissions: props.user.permissions },
      importing: props.isImporting || false,
      message: '',
      valid: false,
      importedCSVData: undefined
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
  }

  render() {
    const finalUser = Object.assign(this.props.user, this.state.modifiedState)
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
    const validations = [new FormValidationRule('firstName', 'isEmpty', false, 'Given name is required'), new FormValidationRule('lastName', 'isEmpty', false, 'Family name is required')]

    if (!finalUser.userAccountId) {
      validations.push(new FormValidationRule('emailAddress', 'isEmpty', false, 'Email Address is required'))
    }
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Upload your CSV file containing the list of users</h5>

          {this.state.message && <div className="alert alert-warning">{this.state.message}</div>}
        </div>
        <form>
          <div className="form-group" />
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
                        <CSVReader onFileLoaded={this.handleReadCSV} inputRef={this.fileInput} style={{ display: 'none' }} onError={this.handleOnError} />
                        <button className="btn btn-outline-success" style={{ width: 'auto' }} onClick={this.handleImportOffer}>
                          Upload CSV file
                        </button>
                        <button
                          disabled={loading}
                          className="btn btn-outline-success"
                          type="button"
                          onClick={() => {
                            let result
                            const CSVData = this.state.importedCSVData.data
                            const mappedData = CSVData.map((item, i) => {
                              let payload = {
                                emailAddress: item[0],
                                firstName: item[1],
                                lastName: item[2],
                                permissions: item[3] === 'User' ? permissionOptions[0].value : permissionOptions[1].value
                              }
                              createUser({ variables: payload })
                            })

                            Promise.all(mappedData).then(() => {
                              this.props.onSave()
                            })
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
