import { Permissions } from './permissions'

import { IScope } from '../types/types'

export const ScopeMap = {
	openid: {
		id: 'openid',
		clientDescription: 'Access a client specific user identifier',
		userDescription: 'Access your user account id',
		required: true,
		permissionLevel: Permissions.User
	},
	offline_access: {
		id: 'offline_access',
		clientDescription: 'Provide the client with a refresh token',
		userDescription: 'Keep you signed in',
		required: false,
		permissionLevel: Permissions.User
	},
	profile: {
		id: 'profile',
		clientDescription: `Access a user's profile information`,
		userDescription: 'View your profile information such as name and profile image',
		required: false,
		permissionLevel: Permissions.User
	},
	email: {
		id: 'email',
		clientDescription: `Access a user's email address `,
		userDescription: 'View your email address',
		required: false,
		permissionLevel: Permissions.User
	},
	'email:write': {
		id: 'email:write',
		clientDescription: `Update a user's email address`,
		userDescription: 'Edit your email address',
		required: false,
		permissionLevel: Permissions.User
	},
	'profile:write': {
		id: 'profile:write',
		clientDescription: `Modify a user's profile information`,
		userDescription: 'Modify your profile information including name and profile image',
		required: false,
		permissionLevel: Permissions.User
	},
	'profile:meta': {
		id: 'profile:meta',
		clientDescription: 'Access application metadata for a user',
		userDescription: 'Read application specific metadata for your profile',
		required: false,
		permissionLevel: Permissions.User
	},

	'admin-profile:write': {
		id: 'admin-profile:write',
		clientDescription: `Modify any user's profile information`,
		userDescription: `ADMIN - Use your administrator priveleges to update user profile information for any user`,
		required: false,

		permissionLevel: Permissions.Admin
	},
	'admin-email:write': {
		id: 'admin-email:write',
		clientDescription: `Modify any user's email address`,
		userDescription: `ADMIN - Use your administrator priveleges to update primary email address for any user`,
		required: false,
		permissionLevel: Permissions.Admin
	}
}

export const Scopes: IScope[] = [
	ScopeMap.openid,
	ScopeMap.offline_access,
	ScopeMap.profile,
	ScopeMap.email,
	ScopeMap['profile:meta'],
	ScopeMap['email:write'],
	ScopeMap['profile:write'],
	ScopeMap['admin-profile:write'],
	ScopeMap['admin-email:write']
]

export const getScopes = () => Scopes.map((scope) => ({ ...scope }))
