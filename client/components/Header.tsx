import React, { useState } from 'react'
import Link from 'next/link'

import { RequirePermission, RequirePermissionModes } from './RequirePermission'
import Permissions from '../utils/permissions'
import Dropdown from 'reactstrap/lib/Dropdown'
import DropdownToggle from 'reactstrap/lib/DropdownToggle'
import DropdownMenu from 'reactstrap/lib/DropdownMenu'
import DropdownItem from 'reactstrap/lib/DropdownItem'
import { IConfiguration } from '../../server/data/models/IConfiguration'
import RequireConfiguration from './RequireConfiguration'

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  return (
    <RequireConfiguration>
      {(configuration: IConfiguration) => {
        return (
          <div className="my-2 w-100" style={{ borderBottom: '1px solid #ddd', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container">
              <div>
                <h3>
                  <img style={{ height: '64px' }} src={configuration.Server.realmLogo} /> {configuration.Server.realmName} Account Management
                </h3>
              </div>
              <ul className="nav nav-tabs flex-no-wrap" style={{ whiteSpace: 'nowrap', textOverflow: 'nowrap', flexWrap: 'nowrap', fontSize: '1.05rem' }} role="navigation">
                <li className="nav-item">
                  <Link href="/personal-info" as="/personal-info">
                    <a className="nav-link">Personal Info</a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/security" as="/security">
                    <a className="nav-link">Security</a>
                  </Link>
                </li>
                <RequirePermission permission={Permissions.ADMIN} mode={RequirePermissionModes.HIDE}>
                  <Dropdown nav inNavbar className="nav-item" isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle nav caret>
                      Admin
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>
                        <Link href="/admin/users" as="/admin/users">
                          <span className="dropdown-item">Users</span>
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link href="/admin/clients" as="/admin/clients">
                          <span className="dropdown-item">Clients</span>
                        </Link>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </RequirePermission>
                <li className="nav-item ml-auto">
                  <Link href="/logout" as="/logout">
                    <a className="nav-link">Logout</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )
      }}
    </RequireConfiguration>
  )
}

export default Header
