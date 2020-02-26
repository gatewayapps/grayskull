// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'
export class UserAccount extends Model {
	public userAccountId: string = this.userAccountId
	public firstName: string = this.firstName
	public lastName: string = this.lastName
	public displayName: string | null = this.displayName
	public lastActive: Date = this.lastActive
	public lastPasswordChange: Date = this.lastPasswordChange
	public passwordHash: string = this.passwordHash
	public gender: string | null = this.gender
	public birthday: Date | null = this.birthday
	public profileImageUrl: string | null = this.profileImageUrl
	public permissions: number = this.permissions
	public otpSecret: string | null = this.otpSecret
	public otpEnabled: boolean = this.otpEnabled

	public isActive: boolean = this.isActive
	public createdBy: string | null = this.createdBy
	public createdAt: Date = this.createdAt
	public updatedBy: string | null = this.updatedBy
	public updatedAt: Date = this.updatedAt
	public deletedBy: string | null = this.deletedBy
	public deletedAt: Date | null = this.deletedAt
}

function UserAccountFactory(sequelize: Sequelize.Sequelize) {
	UserAccount.init(
		{
			userAccountId: {
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				type: Sequelize.UUID
			},
			firstName: {
				allowNull: false,
				type: Sequelize.STRING(30)
			},
			lastName: {
				allowNull: false,
				type: Sequelize.STRING(30)
			},
			displayName: {
				allowNull: true,
				type: Sequelize.STRING(30)
			},
			lastActive: {
				defaultValue: Sequelize.NOW,
				allowNull: false,
				type: Sequelize.DATE
			},
			lastPasswordChange: {
				allowNull: false,
				type: Sequelize.DATE
			},
			passwordHash: {
				allowNull: false,
				type: Sequelize.STRING
			},
			gender: {
				allowNull: true,
				type: Sequelize.STRING
			},
			birthday: {
				allowNull: true,
				type: Sequelize.DATE
			},
			profileImageUrl: {
				allowNull: true,
				type: Sequelize.STRING
			},
			permissions: {
				defaultValue: 0,
				allowNull: false,
				type: Sequelize.INTEGER
			},
			otpSecret: {
				allowNull: true,
				type: Sequelize.STRING
			},
			otpEnabled: {
				defaultValue: false,
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			isActive: {
				defaultValue: true,
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			createdBy: {
				allowNull: true,
				type: Sequelize.UUID
			},
			createdAt: {
				defaultValue: Sequelize.NOW,
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedBy: {
				allowNull: true,
				type: Sequelize.UUID
			},
			updatedAt: {
				defaultValue: Sequelize.NOW,
				allowNull: false,
				type: Sequelize.DATE
			},
			deletedBy: {
				allowNull: true,
				type: Sequelize.UUID
			},
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE
			}
		},
		{ sequelize, timestamps: true, paranoid: true, modelName: 'UserAccount' }
	)
	return UserAccount
}

export default UserAccountFactory
