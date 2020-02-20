import React from 'react'
import 'bootswatch/dist/materia/bootstrap.css'
import 'titatoggle/dist/titatoggle-dist-min.css'
import '../../public/global.css'
import PropTypes from 'prop-types'
import RequireAuthentication from '../components/RequireAuthentication'
import { RequirePermission } from '../components/RequirePermission'
import Permissions from '../utils/permissions'
import Header from '../components/Header'
export default class AuthenticatedRoute extends React.Component {
  static propTypes = {
    permission: PropTypes.number
  }

  static defaultProps = {
    permission: Permissions.USER
  }
  render() {
    return (
      <RequireAuthentication>
        <RequirePermission permission={this.props.permission}>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <div style={{ flexGrow: 1 }}>{this.props.children}</div>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#eee' }} />
          </div>
        </RequirePermission>
      </RequireAuthentication>
    )
  }
}
