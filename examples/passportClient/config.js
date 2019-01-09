module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'http://localhost:3000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5001',
  clientId: process.env.CLIENT_ID || 'passport-client',
  secret: process.env.CLIENT_SECRET || 'f1ad618d36b6f95d95e23aac2762bc0dd709e93431c430eabee3910dc906d78d'
}
