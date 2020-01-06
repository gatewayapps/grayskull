export interface IMailConfiguration {
  serverAddress?: string | null
  username?: string | null
  password?: string | null
  tlsSslRequired?: boolean | null
  port?: number | null
  fromAddress?: string | null;
  sendgridApiKey?: string | null
}
