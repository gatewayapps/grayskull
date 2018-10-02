import Sequelize from 'sequelize'
import { IUserClients } from './IUserClients'

export type UserClientsInstance = Sequelize.Instance<IUserClients> & IUserClients

function UserClientsFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserClients> = {
     userAccountId: {
       type: Sequelize.INTEGER
     },
     clientId: {
       type: Sequelize.INTEGER
     },
     dateCreated: {
          defaultValue: new Date('1990-01-01T00:00:00.000Z'),
       type: Sequelize.DATE
     },
     dateRevoked: {
      allowNull: true,
      type: Sequelize.DATE
     },
     createdBy: {
       type: Sequelize.INTEGER
     },
     revokedBy: {
      allowNull: true,
      type: Sequelize.INTEGER
     },
     revoked: {
       type: Sequelize.BOOLEAN
     },
  }
  return sequelize.define<UserClientsInstance, IUserClients>('UserClients', attributes)
}

export default UserClientsFactory
