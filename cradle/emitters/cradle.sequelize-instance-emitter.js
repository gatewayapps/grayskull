const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions('sequelize-instance', '@gatewayapps/cradle-template-emitter', {
  sourcePath: './cradle/templates/sequelizeInstance.handlebars',
  outputPath: './src/data/context.ts',
  overwriteExisting: true,
  languageType: 'sequelize',
  mode: 'schema',
  onFilesEmitted: utils.lintAndPretty,
  registerCustomHelpers: utils.registerHandleBarHelpers,
})
