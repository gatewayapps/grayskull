import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IClient } from './IClient'

export type ClientInstance = Sequelize.Instance<IClient> & IClient

function ClientFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IClient> = {
    client_id: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    name: {
      type: Sequelize.STRING(50)
    },
    logoImageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING(500)
    },
    secret: {
      type: Sequelize.STRING
    },
    baseUrl: {
      type: Sequelize.STRING
    },
    homePageUrl: {
      type: Sequelize.STRING
    },
    public: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    redirectUri: {
      type: Sequelize.STRING
    },
    isActive: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    modifiedBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    modifiedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<ClientInstance, IClient>('Client', attributes, { timestamps: false })
}

export default ClientFactory
