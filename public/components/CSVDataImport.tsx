import * as React from 'react'

import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import FormValidation, { FormValidationRule } from './FormValidation'
import moment from 'moment'
import Permissions from '../utils/permissions'

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
  importedCSVData: []
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
      importedCSVData: []
    }
  }

  handleReadCSV = (data) => {
    console.log(data)
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  handleImportOffer = () => {
    this.fileInput.current.click()
  }

  render() {
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
            {this.state.importing ? (
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
                <input type="file" className="form-control-file" style={{ width: 'auto' }} />
                <CSVReader onFileLoaded={this.handleReadCSV} inputRef={this.fileInput} style={{ display: 'none' }} onError={this.handleOnError} />
                <button className="btn btn-outline-success" type="button" onClick={this.handleImportOffer}>
                  Import
                </button>
              </div>
            ) : (
              <div>else </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
