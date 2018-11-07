const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions('graphql-interfaces', '@gatewayapps/cradle-template-emitter', {
  sourcePath: './cradle/templates/graphqlInterfaces.handlebars',
  outputPath: './src/interfaces/graphql/I{{Name}}.ts',
  overwriteExisting: true,
  languageType: 'ts',
  onFilesEmitted: utils.lintAndPretty,
  registerCustomHelpers: utils.registerHandleBarHelpers,
})
