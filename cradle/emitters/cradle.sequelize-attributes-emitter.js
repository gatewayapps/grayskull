const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')
module.exports = new cradle.EmitterOptions('sequelize-attributes', '@gatewayapps/cradle-template-emitter', {
  sourcePath: './cradle/templates/sequelizeAttributes.handlebars',
  outputPath: './src/data/models/I{{Name}}.ts',
  overwriteExisting: true,
  languageType: 'ts',
  onFilesEmitted: utils.lintAndPretty
})
