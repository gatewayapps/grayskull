export const SettingsKeys = {
  MAIL_PORT: 'MAIL_PORT',
  MAIL_SSL: 'MAIL_SSL',
  MAIL_HOST: 'MAIL_HOST',
  MAIL_PASSWORD: 'MAIL_PASSWORD',
  MAIL_USER: 'MAIL_USER',
  MAIL_FROM_ADDRESS: 'MAIL_FROM_ADDRESS',
  SECURITY_PASSWORD_EXPIRES_DAYS: 'SECURITY_PASSWORD_EXPIRES_DAYS',
  SECURITY_ACTIVATION_EXPIRES_IN_MINUTES: 'SECURITY_ACTIVATION_EXPIRES_IN_MINUTES',
  SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE: 'SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE',
  SECURITY_PASSWORD_MINIMUM_LENGTH: 'SECURITY_PASSWORD_MINIMUM_LENGTH',
  SECURITY_PASSWORD_REQUIRES_LOWERCASE: 'SECURITY_PASSWORD_REQUIRES_LOWERCASE',
  SECURITY_PASSWORD_REQUIRES_NUMBER: 'SECURITY_PASSWORD_REQUIRES_NUMBER',
  SECURITY_PASSWORD_REQUIRES_SYMBOL: 'SECURITY_PASSWORD_REQUIRES_SYMBOL',
  SECURITY_PASSWORD_REQUIRES_UPPERCASE: 'SECURITY_PASSWORD_REQUIRES_UPPERCASE',
  SECURITY_MULTIFACTOR_REQUIRED: 'SECURITY_MULTIFACTOR_REQUIRED',
  SECURITY_ALLOW_USER_SIGNUP: 'SECURITY_ALLOW_USER_SIGNUP',
  SECURITY_DOMAIN_WHITELIST: 'SECURITY_DOMAIN_WHITELIST',
  SERVER_REALM_LOGO: 'SERVER_REALM_LOGO',
  SERVER_REALM_NAME: 'SERVER_REALM_NAME',
  SERVER_BASE_URL: 'SERVER_BASE_URL'
}

export default {
  Mail: [
    {
      Default: 465,
      Description: 'Outgoing mail server port',
      Example: 465,
      Key: SettingsKeys.MAIL_PORT,
      Label: 'Port',
      Type: 'Number'
    },
    {
      Default: true,
      Description: 'Use SSL for your outgoing E-Mails',
      Key: SettingsKeys.MAIL_SSL,
      Label: 'Enable SSL',
      Type: 'Boolean'
    },
    {
      Description: 'Password for mail server',
      Example: 'password',
      Key: SettingsKeys.MAIL_PASSWORD,
      Label: 'Password',
      Type: 'String'
    },
    {
      Description: 'Server or IP address for your outgoing mail host',
      Example: 'smtp.gmail.com',
      Key: SettingsKeys.MAIL_HOST,
      Label: 'Mail Server Host',
      Type: 'String'
    },
    {
      Description: 'Username for mail server',
      Example: 'grayskull@gmail.com',
      Key: SettingsKeys.MAIL_USER,
      Label: 'Username',
      Type: 'String'
    },
    {
      Description: 'E-mail address to send messages from.',
      Example: 'admin@grayskull.io',
      Key: SettingsKeys.MAIL_FROM_ADDRESS,
      Label: 'From Address',
      Type: 'String'
    }
  ],
  Security: [
    {
      Default: 0,
      Description: 'Require users to change their passwords after so many days (0 = disabled)',
      Example: 90,
      Key: SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS,
      Label: 'Maximum Password Age (days)',
      Type: 'Number'
    },
    {
      Default: 300,
      Description: 'Activation emails will expire after so many minutes (0 = disabled)',
      Example: 300,
      Key: SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES,
      Label: 'Activation Expiration Time (Minutes)',
      Type: 'Number'
    },
    {
      Default: 6,
      Description: 'Rate limit the number of login attempts per minute before a user is locked out.  This helps prevent brute force login attempts. (0 = disabled)',
      Example: 6,
      Key: SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE,
      Label: 'Maxixmum Login Attempts per Minute',
      Type: 'Number'
    },
    {
      Default: 8,
      Description: 'Passwords have to be at least this long',
      Example: 8,
      Key: SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH,
      Label: 'Require Password Length',
      Type: 'Number'
    },
    {
      Default: false,
      Description: 'Passwords require at least 1 lowercase character',
      Key: SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE,
      Label: 'Require Lowercase Character',
      Type: 'Boolean'
    },
    {
      Default: false,
      Description: 'Passwords require at least 1 numeric character (0 - 9)',
      Key: SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER,
      Label: 'Require Numeric Character',
      Type: 'Boolean'
    },
    {
      Default: false,
      Description: 'Passwords require at least 1 symbol character (!, @, $, etc...)',
      Key: SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL,
      Label: 'Require Symbol Character',
      Type: 'Boolean'
    },
    {
      Default: false,
      Description: 'Passwords require at least 1 uppercase character',
      Key: SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE,
      Label: 'Require Uppercase Character',
      Type: 'Boolean'
    },
    {
      Default: false,
      Description: 'Require users to configure at least one form of multifactor authentication',
      Key: SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED,
      Label: 'Require Multifactor Authentication',
      Type: 'Boolean'
    },
    {
      Default: true,
      Description: 'If disabled, an administrator must add new users',
      Key: SettingsKeys.SECURITY_ALLOW_USER_SIGNUP,
      Label: 'Allow Users to Register',
      Type: 'Boolean'
    },
    {
      Description: 'Only allow users with these e-mail addresses to register. Multiple domains should be separated by semicolon',
      Example: 'gmail.com; me.com;',
      Key: SettingsKeys.SECURITY_DOMAIN_WHITELIST,
      Label: 'Allowed Email Domains',
      Type: 'String'
    }
  ],
  Server: [
    {
      Default: 'Grayskull',
      Description: "Name of your Realm.  This should be your organization's name",
      Example: 'Login to your {Realm Name} Account',
      Key: SettingsKeys.SERVER_REALM_NAME,
      Label: 'Realm Name',
      Type: 'String'
    },
    {
      Default: '/grayskull.svg',
      Description: 'Logo for your Realm.  Should be your organization logo.',
      Example: '/grayskull.svg',
      Key: SettingsKeys.SERVER_REALM_LOGO,
      Label: 'Realm Logo',
      Type: 'File'
    },
    {
      Default: 'http://localhost',
      Description: 'Web address for the Grayskull Authentication Server.  The OpenID specification requires a secure authentication server, so use HTTPS if available!',
      Example: 'https://authenticate.yourserver.com',
      Key: SettingsKeys.SERVER_BASE_URL,
      Label: 'Server URL',
      Type: 'String'
    }
  ]
}
