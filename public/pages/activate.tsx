import { withRouter, WithRouterProps } from 'next/router'
import React from 'react'
import Primary from '../layouts/primary'
import BackgroundCover from '../components/BackgroundCover'
import AccountActivation from '../components/AccountActivation'

interface ActivatePageProps {
  emailAddress: string
  token: string
}

const ActivatePage: React.FunctionComponent<WithRouterProps<ActivatePageProps>> = (props) => {
  return (
    <Primary>
      <BackgroundCover>
        <div style={{ flex: 1 }} />
        <div>
          <AccountActivation emailAddress={props.router.query.emailAddress} token={props.router.query.token} />
        </div>
        <div style={{ flex: 1 }} />
      </BackgroundCover>
    </Primary>
  )
}

export default withRouter(ActivatePage)
