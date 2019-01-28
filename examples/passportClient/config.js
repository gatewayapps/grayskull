module.exports = {
  authServerBaseUrl: process.env.AUTH_SERVER_BASE_URL || 'https://grayskull.gatewayapps.net',
  clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:5001',
  clientId: process.env.CLIENT_ID || '5efc421a-1ef2-49f1-8f75-c552c85de78b',
  secret: process.env.CLIENT_SECRET || '9b84625d9bbd699fcd1878497f4db7e554ac25f6b65442469378531686b53805'
}
