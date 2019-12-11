import Sequelize from 'sequelize'

import { KeyValueCache } from './IKeyValueCache'

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
