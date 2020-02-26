// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class Session extends Model {
	public sessionId: string = this.sessionId
	public fingerprint: string = this.fingerprint
	public userAccountId: string = this.userAccountId
	public name: string | null = this.name
	public ipAddress: string = this.ipAddress
	public lastUsedAt: Date = this.lastUsedAt
	public expiresAt: Date = this.expiresAt
	public createdBy: string | null = this.createdBy
	public createdAt: Date = this.createdAt
	public updatedBy: string | null = this.updatedBy
	public updatedAt: Date = this.updatedAt
}

function SessionFactory(sequelize: Sequelize.Sequelize) {
	Session.init(
		{
			sessionId: {
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				type: Sequelize.UUID
			},
			fingerprint: {
				allowNull: false,
				type: Sequelize.STRING
			},
			userAccountId: {
				allowNull: false,
				type: Sequelize.UUID
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING(100)
			},
			ipAddress: {
				allowNull: false,
				type: Sequelize.STRING(50)
			},
			lastUsedAt: {
				defaultValue: Sequelize.NOW,
				allowNull: false,
				type: Sequelize.DATE
			},
			expiresAt: {
				allowNull: false,
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
			}
		},
		{ modelName: 'Session', sequelize, timestamps: true, paranoid: false }
	)
	return Session
}

export default SessionFactory
