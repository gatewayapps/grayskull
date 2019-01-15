const cradle = require('@gatewayapps/cradle')
const TemplateEmitter = require('@gatewayapps/cradle-template-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'sequelize-models',
  new TemplateEmitter({
    sourcePath: './cradle/templates/sequelizeModel.handlebars',
    outputPath: './src/data/models/{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'sequelize',
    onFilesEmitted: utils.lintAndPretty,
    registerCustomHelpers: utils.registerHandleBarHelpers,
    shouldEmit: (model) => {
      return model.Meta !== undefined && model.Meta.database === true
    },
  }, console)
)
