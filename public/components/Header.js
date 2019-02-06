import Link from './ActiveLink'

import ConfigurationContext from '../contexts/ConfigurationContext'

const Header = () => (
  <ConfigurationContext.Consumer>
    {(configuration) => {
      console.log('config is', configuration)
      return (
        <div className="mb-2 w-100" style={{ borderBottom: '1px solid #ddd' }}>
          <div className="container">
            <div>
              <h3>
                <img style={{ height: '64px' }} src="/static/grayskull.svg" /> {configuration.serverConfiguration.realmName} Account Management
              </h3>
            </div>
            <ul className="nav nav-tabs" role="navigation" style={{ fontSize: '1.05rem' }}>
              <li className="nav-item">
                <Link href="/home" as="home">
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/personal-info" as="personal-info">
                  <a className="nav-link">Personal Info</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/applications" as="applications">
                  <a className="nav-link">Applications</a>
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
