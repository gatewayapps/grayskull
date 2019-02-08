import * as React from 'react'
import MutationButton from './MutationButton'
import gql from 'graphql-tag'

const SET_PRIMARY_MUTATION = gql`
  mutation SET_PRIMARY($emailAddressId: String!) {
    setEmailAddressPrimary(emailAddressId: $emailAddressId) {
      success
      message
    }
  }
`

const RESEND_VERIFICATION = gql`
  mutation RESEND_VERIFICATION($emailAddressId: String!) {
    sendVerification(emailAddressId: $emailAddressId) {
      success
      message
    }
  }
`

export interface EmailAddressListItemProps {
  refetch: any
  emailAddress: {
    emailAddressId: string
    emailAddress: string
    verified: boolean
    primary: boolean
  }
}

export interface EmailAddressListItemState {
  verificationSent: boolean
}

export default class EmailAddressListItem extends React.Component<EmailAddressListItemProps, EmailAddressListItemState> {
  constructor(props) {
    super(props)

    this.state = {
      verificationSent: false
    }
  }
  public render() {
    const e = this.props.emailAddress
    return (
      <li className="list-group-item w-100 d-flex align-items-center">
        {e.verified ? <i className="text-primary fa fa-fw fa-check-circle mr-2" /> : <i className="text-muted fa fa-fw fa-question-circle mr-2" />}
        {e.emailAddress}
        {e.primary && <div className="ml-2 badge badge-primary">PRIMARY</div>}
        {this.state.verificationSent && (
          <button className="ml-auto btn btn-outline-default btn-sm" disabled>
            Verification Sent
          </button>
        )}
        {!e.verified &&
          !this.state.verificationSent && (
            <MutationButton
              mutation={RESEND_VERIFICATION}
              variables={{ emailAddressId: e.emailAddressId }}
              onSuccess={() => {
                this.setState({ verificationSent: true })
              }}
              onFail={() => {}}
              content={
                <span>
                  <i className="fa fa-fw fa-envelope" /> Re-send Verification
                </span>
              }
              busyContent={
                <span>
                  <i className="fa fa-fw fa-spin fa-spinner" /> Sending
                </span>
              }
              className="ml-auto btn btn-sm btn-secondary"
            />
          )}
        {!e.primary &&
          e.verified && (
            <MutationButton
              mutation={SET_PRIMARY_MUTATION}
              variables={{ emailAddressId: e.emailAddressId }}
              onSuccess={() => {
                this.props.refetch()
              }}
              onFail={() => {}}
              content={
                <span>
                  <i className="fa fa-fw fa-check" /> Set Primary
                </span>
              }
              busyContent={
                <span>
                  <i className="fa fa-fw fa-spin fa-spinner" /> Updating
                </span>
              }
              className="ml-auto btn btn-sm btn-primary"
            />
          )}
      </li>
    )
  }
}
