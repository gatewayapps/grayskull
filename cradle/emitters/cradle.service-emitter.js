const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')

module.exports =
new cradle.EmitterOptions('service', '@gatewayapps/cradle-template-emitter', {
  sourcePath: './cradle/templates/service.handlebars',
  outputPath: './src/api/services/{{Name}}Service.ts',
  overwriteExisting: false,
  languageType: 'ts',
  onFilesEmitted: utils.lintAndPretty
})
