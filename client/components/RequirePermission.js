import React from 'react'
import UserContext from '../contexts/UserContext'
import PropTypes from 'prop-types'

export const RequirePermissionModes = {
  HIDE: 'HIDE',
  SHOW_ERROR: 'SHOW_ERROR'
}

export class RequirePermission extends React.Component {
  static propTypes = {
    permission: PropTypes.number.isRequired,
    mode: PropTypes.string
  }
  static defaultProps = {
    mode: RequirePermissionModes.SHOW_ERROR
  }
  render = () => {
    return (
      <UserContext.Consumer>
        {({ user }) => {
          //For now we will just check >=.  In the future we need to bitwise and

          if (user && user.permissions >= this.props.permission) {
            return this.props.children
          } else {
            switch (this.props.mode) {
              case RequirePermissionModes.SHOW_ERROR:
                return <h5>Not Authorized</h5>
              case RequirePermissionModes.HIDE:
                return null
              default:
                return null
            }
          }
        }}
      </UserContext.Consumer>
    )
  }
}
