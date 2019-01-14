const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'service-base',
  new TemplateEmitter({
    sourcePath: './cradle/templates/serviceBase.handlebars',
    outputPath: './src/api/services/.cradle/{{Name}}ServiceBase.ts',
    overwriteExisting: true,
    languageType: 'ts',
    onFilesEmitted: utils.lintAndPretty,
    registerCustomHelpers: utils.registerHandleBarHelpers,
    shouldEmit: (model) => {
      return model.Meta !== undefined && model.Meta.topLevel
    },
  }, console)
)
