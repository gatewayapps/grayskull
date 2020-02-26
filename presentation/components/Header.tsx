import React, { useState } from 'react'

import { RequirePermission, RequirePermissionModes } from './RequirePermission'
import Permissions from '../utils/permissions'
import Dropdown from 'reactstrap/lib/Dropdown'
import DropdownToggle from 'reactstrap/lib/DropdownToggle'
import DropdownMenu from 'reactstrap/lib/DropdownMenu'
import DropdownItem from 'reactstrap/lib/DropdownItem'
import { IConfiguration } from '../../foundation/models/IConfiguration'
import RequireConfiguration from './RequireConfiguration'
import ActiveLink from './ActiveLink'

const Header = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const toggle = () => setDropdownOpen((prevState) => !prevState)

	return (
		<RequireConfiguration>
			{(configuration: IConfiguration & { HeaderItems: any }) => {
				return (
					<div
						className="pt-2 mb-2 w-100"
						style={{
							borderBottom: '1px solid #ddd',
							backgroundColor: 'white',
							position: 'sticky',
							top: 0,
							zIndex: 50
						}}>
						<div className="container">
							<div>
								<h3>
									<img style={{ height: '64px' }} src={configuration.Server.realmLogo} />{' '}
									{configuration.Server.realmName} Account Management
								</h3>
							</div>
							<ul
								className="nav nav-tabs flex-no-wrap"
								style={{ whiteSpace: 'nowrap', textOverflow: 'nowrap', flexWrap: 'nowrap', fontSize: '1.05rem' }}
								role="navigation">
								{configuration.HeaderItems && configuration.HeaderItems.length > 0 ? (
									<li className="nav-item">
										<a className="nav-link" href={configuration.HeaderItems[0].baseUrl}>
											{configuration.HeaderItems[0].name}
										</a>
									</li>
								) : null}
								<li className="nav-item">
									<ActiveLink activeClassName="active" href="/personal-info" as="/personal-info">
										<a className="nav-link">Personal Info</a>
									</ActiveLink>
								</li>

								<li className="nav-item">
									<ActiveLink href="/security" as="/security">
										<a className="nav-link">Security</a>
									</ActiveLink>
								</li>
								<RequirePermission permission={Permissions.ADMIN} mode={RequirePermissionModes.HIDE}>
									<Dropdown nav inNavbar className="nav-item" isOpen={dropdownOpen} toggle={toggle}>
										<DropdownToggle nav caret>
											Admin
										</DropdownToggle>
										<DropdownMenu>
											<ActiveLink href="/admin/users" as="/admin/users">
												<DropdownItem className="py-2">Users</DropdownItem>
											</ActiveLink>

											<ActiveLink href="/admin/clients" as="/admin/clients">
												<DropdownItem className="py-2">Clients</DropdownItem>
											</ActiveLink>

											<DropdownItem divider />

											<ActiveLink href="/admin/config/server" as="/admin/config/server">
												<DropdownItem className="py-2">Server Configuration</DropdownItem>
											</ActiveLink>
											<ActiveLink href="/admin/config/security" as="/admin/config/security">
												<DropdownItem className="py-2">Security Configuration</DropdownItem>
											</ActiveLink>
											<ActiveLink href="/admin/config/mail" as="/admin/config/mail">
												<DropdownItem className="py-2">Mail Configuration</DropdownItem>
											</ActiveLink>
											<DropdownItem divider />
											<ActiveLink href="/admin/config/backup" as="/admin/config/backup">
												<DropdownItem className="py-2">Backup & Restore</DropdownItem>
											</ActiveLink>
										</DropdownMenu>
									</Dropdown>
								</RequirePermission>
								<li className="nav-item ml-auto">
									<ActiveLink href="/logout" as="/logout">
										<a className="nav-link">Logout</a>
									</ActiveLink>
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
