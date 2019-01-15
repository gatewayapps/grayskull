const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'service',
  new TemplateEmitter({
    sourcePath: './cradle/templates/service.handlebars',
    outputPath: './src/api/services/{{Name}}Service.ts',
    overwriteExisting: false,
    languageType: 'ts',
    onFilesEmitted: utils.lintAndPretty,
    registerCustomHelpers: utils.registerHandleBarHelpers,
    shouldEmit: (model) => {
      return model.Meta !== undefined && model.Meta.database === true
    },
  }, console)
)
