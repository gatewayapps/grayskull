// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class KeyValueCache extends Model {
  public key: string = this.key
  public value: string = this.value
  public expires: Date = this.expires
}

function KeyValueCacheFactory(sequelize: Sequelize.Sequelize) {
  KeyValueCache.init(
    {
      key: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING(2048)
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING(2048)
      },
      expires: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    { sequelize, timestamps: false, paranoid: false, tableName: 'KeyValueCache' }
  )
  return KeyValueCache
}

export default KeyValueCacheFactory
