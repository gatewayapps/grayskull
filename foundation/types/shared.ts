export interface IAuthorizedUser {
	sub: string
	given_name: string
	family_name: string
	birthday?: Date
	gender?: string
	active_at: Date
	updated_at: Date
	email: string
	email_verified: boolean
	nickname?: string
	picture?: string
	meta?: { [key: string]: string }
}

export type IAuthorizedUserFields = Pick<
	IAuthorizedUser,
	'given_name' | 'family_name' | 'gender' | 'nickname' | 'picture' | 'email' | 'birthday'
>
