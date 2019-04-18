import React from 'react'

interface AccountActivationProps {
  emailAddress: string
  token: string
}

const AccountActivation: React.FunctionComponent<AccountActivationProps> = (props) => {
  return (
    <div>
      <p>Hello from the activate page</p>
      <p>Email Address: {props.emailAddress}</p>
      <p>Token: {props.token}</p>
    </div>
  )
}

export default AccountActivation
