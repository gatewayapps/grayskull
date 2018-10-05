import { IGeneralOptions } from '../src/config/IGeneralOptions'
import { IMailOptions } from '../src/config/IMailOptions'
import { ISecurityOptions } from '../src/config/ISecurityOptions'

const defaultConfig: { General: IGeneralOptions; Mail: IMailOptions; Security: ISecurityOptions } = {
  General: {
    clientsFilePath: '../config/clients.json',
    port: 3000,
    realmName: 'Grayskull',
    databaseConnectionString: 'postgres://root:pass@127.0.0.1:5432/grayskull'
  },
  Mail: {
    host: 'localhost',
    user: '',
    password: '',
    ssl: false,
    port: 1025
  },
  Security: {
    maxLoginAttemptsPerMinute: 10,
    passwordExpiresDays: 0,
    passwordRequireLowercase: false,
    passwordRequireUppercase: false,
    passwordRequireNumber: false,
    passwordRequireSymbol: false,
    passwordMinimumLength: 8,
    multifactorRequired: false,
    adminEmailAddress: 'admin@grayskull.io',
    globalSecret: 'dLTpAgSerfGq74rVIhz7ILHUTWcoPl5M6nzAjRmvvRMV8aZ8Jm20mygSsyiurfhN',
    invitationExpiresIn: 1800
  }
}

export default defaultConfig
