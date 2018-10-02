const cradle = require('@gatewayapps/cradle')

const loaderOptions = new cradle.LoaderOptions('spec', {
  source: './cradle/cradle.yml'
}, console)

const emitterOptions = [
  new cradle.EmitterOptions('sequelizeAttributes', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeAttributes.handlebars',
    outputPath: './src/data/models/I{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'ts'
  }),
  new cradle.EmitterOptions('sequelizeInstance', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeInstance.handlebars',
    outputPath: './src/data/index.ts',
    overwriteExisting: true,
    languageType: 'sequelize',
    mode: 'schema'
  }),
  new cradle.EmitterOptions('sequelizeModels', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeModel.handlebars',
    outputPath: './src/data/models/{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'sequelize'
  }),
  new cradle.EmitterOptions('serviceBase', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/serviceBase.handlebars',
    outputPath: './src/api/services/{{Name}}ServiceBase.ts',
    overwriteExisting: true,
    languageType: 'ts'
  }),
  new cradle.EmitterOptions('service', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/service.handlebars',
    outputPath: './src/api/services/{{Name}}Service.ts',
    overwriteExisting: false,
    languageType: 'ts'
  })
]

module.exports = new cradle.CradleConfig(loaderOptions, emitterOptions)