# Grayskull Authentication Server

An easy to use authentication server that can be deployed to your own server in seconds.

# Features

- Multifactor authentication
- OpenID Connect and OAuth 2.0
- Supports authorization_code and refresh_token flows
- Security features to enable self-registration, domain restrictions, require MFA
- Email address verification
- Client Application management
- Strong password hashing
- Use Sendgrid or a standard SMTP server for sending emails
- User profile editing and password management

# Required Environment Variables

- **GRAYSKULL_GLOBAL_SECRET** - Secret used for encryption purposes
- **GRAYSKULL_DB_CONNECTION_STRING** - Sequelize connection string

# Optional Environment Variables

- **CLOUDINARY_URL** - Cloudinary URL. See https://cloudinary.com/documentation/node_integration#node_getting_started_guide for instructions
- **CLOUDINARY_FOLDER** - Folder[s] within Cloudinary to store uploads - grayskull/dev/ for example

# Requirements

Node 12
One of the following:

- Sqlite
- Postgres
- MySQL
- SQL Server

# Development

To get started developing, clone the repo.

1. Clone the repo
2. Yarn install
3. Create a .env file and populate the GRAYSKULL_GLOBAL_SECRET and GRAYSKULL_DB_CONNECTION_STRING
4. F5 in VSCode

#### .env file sample

```
GRAYSKULL_GLOBAL_SECRET=abcdefg1234567
GRAYSKULL_DB_CONNECTION_STRING=sqlite:/home/grayskull/meta.db
```

# Deployment

There are a few easy ways to deploy Grayskull

#### Docker

There is a release build of docker available here: https://hub.docker.com/repository/docker/gatewayapps/grayskull

_Sample docker-compose.yml_

```yaml
services:
  grayskull:
    image: gatewayapps/grayskull
    ports:
      - 3000:3000
    volumes:
      - /usr/local/grayskull:/usr/local/grayskull
    environment:
      - NODE_ENV=production
      - GRAYSKULL_DB_CONNECTION_STRING=sqlite:/usr/local/grayskull/meta.db
      - GRAYSKULL_GLOBAL_SECRET=abcdefg1234567
```

#### Zeit Now

We have a node script for deploying to Zeit's Now located at https://github.com/gatewayapps/grayskull-deployment

Clone that repo and create a now.json file inside it.

_Sample now.json_

```json
{
  "version": 2,
  "name": "grayskull-authentication",
  "scope": "grayskull-demo",
  "builds": [
    {
      "src": "./package.json",
      "use": "@now/next@canary",
      "config": { "bundle": false }
    }
  ],
  "env": {
    "GRAYSKULL_GLOBAL_SECRET": "@grayskull_global_secret",
    "GRAYSKULL_DB_CONNECTION_STRING": "@grayskull_db_connection_string",
    "NODE_ENV": "production"
  }
}
```

You will need to follow Zeit's instructions for configuring secrets in Now - https://zeit.co/docs/v2/serverless-functions/env-and-secrets

Once you have your secrets configured and are authenticated with the now CLI, run node ./index.js and it will deploy the latest release of Grayskull.
