# grayskull

An OpenID Connect Server

# Environment Variables

- **CLOUDINARY_URL** - Cloudinary URL. See https://cloudinary.com/documentation/node_integration#node_getting_started_guide for instructions
- **CLOUDINARY_FOLDER** - Folder[s] to store uploads in - grayskull/dev/ for example
- **GRAYSKULL_GLOBAL_SECRET** - Secret used for encryption purposes
- **GRAYSKULL_DB_CONNECTION_STRING** - Sequelize connection string
- **GRAYSKULL_DB_PROVIDER** - Dialect to use for Sequelize. mssql, postgres, etc...
- **GRAYSKULL_DB_HOST** - Server address for Grayskull Database
- **GRAYSKULL_DB_LOGIN** - Username to connect to Database
- **GRAYSKULL_DB_PASSWORD** - Password to connect to Database
- **GRAYSKULL_DB_STORAGE** - Optional parameter for SQLITE file storage
