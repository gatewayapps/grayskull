const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'repository',
  new TemplateEmitter(
    {
      sourcePath: './.cradle/templates/repository.handlebars',
      outputPath: './src/data/repositories/{{Name}}Repository.ts',
      overwriteExisting: true,
      languageType: 'ts',
      onFilesEmitted: utils.lintAndPretty,
      registerCustomHelpers: utils.registerHandleBarHelpers,
      shouldEmit: (model) => {
        return model.Meta !== undefined && model.Meta.database === true
      }
    },
    console
  )
)
