module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'http://localhost:3000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5000',
  clientId: process.env.CLIENT_ID || 1,
  secret: process.env.CLIENT_SECRET || 'your-super-secret-key'
}
