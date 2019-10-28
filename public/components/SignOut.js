import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'
import { generateRoutingState } from '../utils/routing'

const SignOut = ({ includeState, router, children, ...otherProps }) => {
  const href = `/logout${includeState ? `?state=${generateRoutingState(router)}` : ''}`
  return (
    <a href={href} {...otherProps}>
      {children}
    </a>
  )
}

SignOut.propTypes = {
  includeState: PropTypes.bool
}

export default withRouter(SignOut)
