import { withRouter } from 'next/router'
import React from 'react'
import Primary from '../layouts/primary'
import BackgroundCover from '../components/BackgroundCover'
import AccountActivation from '../components/AccountActivation'

interface ActivatePageProps {
  emailAddress: string
  token: string
}

const ActivatePage: React.FunctionComponent<any> = (props) => {
  return (
    <Primary>
      <BackgroundCover>
        <AccountActivation emailAddress={props.router.query.emailAddress} token={props.router.query.token} />
      </BackgroundCover>
    </Primary>
  )
}

export default withRouter(ActivatePage)
