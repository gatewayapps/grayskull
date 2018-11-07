module.exports = {
  General: {
    grayskullClientId: 1,
    clientsFilePath: '../config/clients.json',
    port: 3000,
    realmName: 'Grayskull',
    databaseConnectionString: 'postgres://root:pass@127.0.0.1:5432/grayskull',
    fallbackUrl: 'http://localhost:3000'
  },
  Mail: {
    host: '127.0.0.1',
    user: '',
    password: '',
    ssl: false,
    port: 1025
  },
  Security: {
    maxLoginAttemptsPerMinute: 10,
    passwordExpiresDays: 0,
    passwordRequireLowercase: true,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSymbol: true,
    passwordMinimumLength: 8,
    multifactorRequired: false,
    adminEmailAddress: 'admin@grayskull.io',
    globalSecret: 'dLTpAgSerfGq74rVIhz7ILHUTWcoPl5M6nzAjRmvvRMV8aZ8Jm20mygSsyiurfhN',
    invitationExpiresIn: 1800,
    accessTokenExpiresIn: 1800
  }
}
