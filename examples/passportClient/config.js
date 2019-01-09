module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'http://localhost:3000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5001',
  clientId: process.env.CLIENT_ID || 2,
  secret: process.env.CLIENT_SECRET || 'e2ded7392cbc8735aa4c7b4950f0909fcd5a8483e357d3d00d95f8767f3e7f6e'
}
