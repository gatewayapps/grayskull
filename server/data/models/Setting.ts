// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class Setting extends Model {
  public key: string = this.key
  public value: string = this.value
  public type: string = this.type
  public category: string = this.category
}

function SettingFactory(sequelize: Sequelize.Sequelize) {
  Setting.init(
    {
      key: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },
    { sequelize, timestamps: true, paranoid: false, tableName: 'Settings' }
  )
  return Setting
}

export default SettingFactory
