const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'sequelize-instance',
  new TemplateEmitter(
    {
      sourcePath: './.cradle/templates/sequelizeInstance.handlebars',
      outputPath: './src/data/context.ts',
      overwriteExisting: true,
      languageType: 'sequelize',
      mode: 'schema',
      onFilesEmitted: utils.lintAndPretty,
      registerCustomHelpers: utils.registerHandleBarHelpers,
      shouldEmit: (model) => {
        return model.Meta !== undefined && model.Meta.database === true
      }
    },
    console
  )
)
