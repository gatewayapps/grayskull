const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'sequelize-attributes',
  new TemplateEmitter({
    sourcePath: './cradle/templates/sequelizeAttributes.handlebars',
    outputPath: './src/data/models/I{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'ts',
    onFilesEmitted: utils.lintAndPretty,
    shouldEmit: (model) => {
      return  model.Name !== 'Configuration'
    },
    registerCustomHelpers: utils.registerHandleBarHelpers,
  }, console)
)
