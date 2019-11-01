const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'graphql-interfaces',
  new TemplateEmitter(
    {
      sourcePath: './.cradle/templates/graphqlInterfaces.handlebars',
      outputPath: './server/interfaces/graphql/I{{Name}}.ts',
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
