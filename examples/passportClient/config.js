module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'http://localhost:3000',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5001',
  clientId: process.env.CLIENT_ID || '7911d298-0698-40fb-bb5e-2bf695f45575',
  secret: process.env.CLIENT_SECRET || '5b7ff940c3203dc993c3fb9bcc05a2940bc5e744e45bbc1517cf533ab5aa2d4b'
}
