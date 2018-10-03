export interface IUserAccount {
    dateCreated?: Date
    emailAddress: string
    emailVerified: boolean
    firstName: string
    lastActive?: Date
    lastName: string
    lastPasswordChange: Date
    password_hash: string
    phoneNumber: string
    profileImageUrl: string
    userAccountId?: number
}
