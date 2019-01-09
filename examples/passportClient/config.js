module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'http://localhost:3000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5001',
  clientId: process.env.CLIENT_ID || 'passport-client',
  secret: process.env.CLIENT_SECRET || '278d5bdca7b3fce136e8acd015ffa160d332fa4550af490b84af2d90cd6bfdad'
}
