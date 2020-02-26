// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class UserClient extends Model {
	public userClientId: string = this.userClientId
	public userAccountId: string = this.userAccountId
	public client_id: string = this.client_id
	public allowedScopes: string = this.allowedScopes
	public deniedScopes: string = this.deniedScopes
	public revoked: boolean = this.revoked
	public revokedBy: string | null = this.revokedBy
	public RevokedAt: Date | null = this.RevokedAt
	public createdBy: string | null = this.createdBy
	public createdAt: Date = this.createdAt
	public updatedBy: string | null = this.updatedBy
	public updatedAt: Date = this.updatedAt
	public deletedBy: string | null = this.deletedBy
	public deletedAt: Date | null = this.deletedAt
}

function UserClientFactory(sequelize: Sequelize.Sequelize) {
	UserClient.init(
		{
			userClientId: {
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				type: Sequelize.UUID
			},
			userAccountId: {
				unique: 'userClient',
				allowNull: false,
				type: Sequelize.UUID
			},
			client_id: {
				unique: 'userClient',
				allowNull: false,
				type: Sequelize.STRING(50)
			},
			allowedScopes: {
				allowNull: false,
				type: Sequelize.STRING(1000)
			},
			deniedScopes: {
				allowNull: false,
				type: Sequelize.STRING(1000)
			},
			revoked: {
				defaultValue: false,
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			revokedBy: {
				allowNull: true,
				type: Sequelize.UUID
			},
			RevokedAt: {
				allowNull: true,
				type: Sequelize.DATE
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
		{
			modelName: 'UserClient',
			timestamps: true,
			paranoid: true,
			sequelize
		}
	)
	return UserClient
}

export default UserClientFactory
