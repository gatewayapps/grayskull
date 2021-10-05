import React from 'react'
import 'bootswatch/dist/materia/bootstrap.css'
import 'titatoggle/dist/titatoggle-dist-min.css'
import '../../public/global.css'
import RequireAuthentication from '../components/RequireAuthentication'
import { RequirePermission } from '../components/RequirePermission'
import Header from '../components/Header'
import { Footer } from '../components/Footer'
import Permissions from '../utils/permissions'

interface AuthenticatedRouteProps {
	permission: number
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = (props, { permission = Permissions.USER }) => {
	return (
		<RequireAuthentication>
			<RequirePermission permission={permission}>
				<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
					<Header />

					<div style={{ flexGrow: 1, paddingBottom: '2rem' }}>{props.children}</div>
					<Footer />
				</div>
			</RequirePermission>
		</RequireAuthentication>
	)
}

export default AuthenticatedRoute
