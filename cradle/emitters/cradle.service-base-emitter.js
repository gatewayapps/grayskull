const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions('service-base', '@gatewayapps/cradle-template-emitter', {
  sourcePath: './cradle/templates/serviceBase.handlebars',
  outputPath: './src/api/services/.cradle/{{Name}}ServiceBase.ts',
  overwriteExisting: true,
  languageType: 'ts',
  onFilesEmitted: utils.lintAndPretty,
  registerCustomHelpers: utils.registerHandleBarHelpers,
})
