import Link from './ActiveLink'

import ConfigurationContext from '../contexts/ConfigurationContext'
import { RequirePermission, RequirePermissionModes } from './RequirePermission'
import Permissions from '../utils/permissions'

const Header = () => (
  <ConfigurationContext.Consumer>
    {(configuration) => {
      console.log('config is', configuration)
      return (
        <div className="my-2 w-100" style={{ borderBottom: '1px solid #ddd' }}>
          <div className="container">
            <div>
              <h3>
                <img style={{ height: '64px' }} src="/static/grayskull.svg" /> {configuration.serverConfiguration.realmName} Account Management
              </h3>
            </div>
            <ul className="nav nav-tabs flex-no-wrap" style={{ overflowX: 'auto' }} role="navigation" style={{ fontSize: '1.05rem' }}>
              <li className="nav-item">
                <Link href="/" as="/">
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/personal-info" as="/personal-info">
                  <a className="nav-link">Personal Info</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/applications" as="/applications">
                  <a className="nav-link">Applications</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/security" as="/security">
                  <a className="nav-link">Security</a>
                </Link>
              </li>
              <RequirePermission permission={Permissions.ADMIN} mode={RequirePermissionModes.HIDE}>
                <li className="nav-item dropdown">
                  <a id="adminDropdown" className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                    Admin
                  </a>
                  <div className="dropdown-menu" aria-labeledby="adminDropdown">
                    <Link href="/admin/users" as="/admin/users">
                      <a className="dropdown-item">Users</a>
                    </Link>
                    <Link href="/admin/clients" as="/admin/clients">
                      <a className="dropdown-item">Clients</a>
                    </Link>
                    <div class="dropdown-divider" />
                    <Link href="/admin/config/server" as="/admin/config/server">
                      <a className="dropdown-item">Server Options</a>
                    </Link>
                    <Link href="/admin/config/security" as="/admin/config/security">
                      <a className="dropdown-item">Realm Security</a>
                    </Link>
                    <Link href="/admin/config/mail" as="/admin/config/mail">
                      <a className="dropdown-item">Mail Options</a>
                    </Link>
                  </div>
                </li>
              </RequirePermission>
              <li className="nav-item ml-auto">
                <Link href="/help" as="/help">
                  <a className="nav-link">Help</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )
    }}
  </ConfigurationContext.Consumer>
)

export default Header
