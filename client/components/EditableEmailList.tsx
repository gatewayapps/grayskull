import * as React from 'react'
import gql from 'graphql-tag'
import { Query, QueryResult } from 'react-apollo'
import LoadingIndicator from './LoadingIndicator'
import { OperationVariables } from 'apollo-client'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import EmailAddressListItem from './EmailAddressListItem'
import MutationButton from './MutationButton'

const MY_EMAIL_ADDRESSES_QUERY = gql`
  query MY_EMAIL_ADDRESSES_QUERY {
    myEmailAddresses {
      emailAddressId
      emailAddress
      verified
      primary
    }
  }
`
const ADD_EMAIL_ADDRESS_MUTATION = gql`
  mutation ADD_EMAIL_ADDRESS_MUTATION($emailAddress: String!) {
    addEmailAddress(emailAddress: $emailAddress) {
      success
      message
    }
  }
`

export interface EditableEmailListProps {
  style: object
}

export interface EditableEmailListState {
  isAdding: boolean
  newEmailAddress: string
  message: string
  errorMessage: string
}

export default class EditableEmailList extends React.Component<EditableEmailListProps, EditableEmailListState> {
  constructor(props: EditableEmailListProps) {
    super(props)

    this.state = {
      isAdding: false,
      newEmailAddress: '',
      message: '',
      errorMessage: ''
    }
  }

  private renderAddEmailAddressBody = (refetch: any) => (
    <div className="card m-4 mt-2">
      <div className="card-body">
        <h6 className="card-title">Add E-Mail Address</h6>
        <ResponsiveValidatingInput
          name="newEmailAddress"
          value={this.state.newEmailAddress}
          onChange={(e) => {
            this.setState({ newEmailAddress: e.target.value })
          }}
          label="New E-mail"
          type="email"
        />
        {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
        {this.state.errorMessage && <div className="alert alert-danger">{this.state.errorMessage}</div>}
      </div>
      <div className="card-footer d-flex">
        <div className="btn-toolbar ml-auto">
          <button
            onClick={() => {
              this.setState({ isAdding: false, message: '', errorMessage: '', newEmailAddress: '' })
            }}
            className="btn btn-secondary mr-2">
            <i className="fa fa-fw fa-times" /> Cancel
          </button>
          <MutationButton
            mutation={ADD_EMAIL_ADDRESS_MUTATION}
            variables={{ emailAddress: this.state.newEmailAddress }}
            busyContent={
              <span>
                <i className="fa fa-fw fa-spin fa-spinner" /> Adding
              </span>
            }
            onSuccess={() => {
              refetch()
              this.setState({ isAdding: false, newEmailAddress: '', message: '', errorMessage: '' })
            }}
            onFail={() => {}}
            content={
              <span>
                <i className="fa fa-fw fa-save" /> Save E-Mail Address
              </span>
            }
            // onClick={async () => {
            //   const saveResult = await addEmailAddress({ variables: { emailAddress: this.state.newEmailAddress } })
            //   if (saveResult && saveResult.data.addEmailAddress.success) {
            //     refetch()
            //     this.setState({ isAdding: false, newEmailAddress: '', message: '', errorMessage: '' })
            //   } else {
            //     this.setState({ errorMessage: saveResult ? saveResult.data.addEmailAddress.message : 'Something went wrong' })
            //   }
            // }}
            className="btn btn-outline-success">
            <i className="fa fa-fw fa-save" /> Save E-Mail Address
          </MutationButton>
        </div>
      </div>
    </div>
  )

  public render() {
    return (
      <div className="card" style={this.props.style}>
        <Query query={MY_EMAIL_ADDRESSES_QUERY}>
          {(result: QueryResult<any, OperationVariables>) => {
            if (result.loading) {
              return <LoadingIndicator />
            } else {
              return (
                <div>
                  <div className="card-body">
                    <h5 className="card-title">Email Addresses</h5>
                    <ul className="list-group">
                      {result.data.myEmailAddresses.map((e) => (
                        <EmailAddressListItem key={e.emailAddressId} refetch={result.refetch} emailAddress={e} />
                      ))}
                    </ul>

                    {this.state.isAdding && this.renderAddEmailAddressBody(result.refetch)}
                  </div>
                  <div className="card-footer d-flex">
                    <div className="btn-toolbar ml-auto">
                      <button
                        disabled={this.state.isAdding}
                        className="btn btn-outline-success"
                        onClick={() => {
                          this.setState({ isAdding: true })
                        }}>
                        <i className="fa fa-fw fa-plus" /> Add E-Mail Address
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          }}
        </Query>
      </div>
    )
  }
}
