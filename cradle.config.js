const Promise = require('bluebird')
const cradle = require('@gatewayapps/cradle')
const tslint = require('tslint')
const fs = require('fs')
const prettier = require('prettier')
const ts = tslint.Linter.createProgram('tsconfig.json', './')
const linter = new tslint.Linter({
  fix: true,
  formatter: 'json'
})

const prettierOptions = require('./prettier.config.js')

function lintAndPretty(filePath) {
  let success = false
  let fileContents
  while (!success) {
    try {
      fileContents = fs.readFileSync(filePath, 'utf8')
      success = true
    } catch (err) {}
  }

  const prettierOptions = require('./prettier.config.js')
  const prettyText = prettier.format(fileContents, require('./prettier.config.js'))

  const configuration = tslint.Configuration.findConfiguration('tslint.json', filePath).results
  linter.lint(filePath, prettyText, configuration)
}

const loaderOptions = new cradle.LoaderOptions(
  'spec',
  {
    source: './cradle/cradle.yml'
  },
  console
)

const emitterOptions = [
  new cradle.EmitterOptions('sequelizeAttributes', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeAttributes.handlebars',
    outputPath: './src/data/models/I{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'ts',
    onFileEmitted: lintAndPretty
  }),
  new cradle.EmitterOptions('sequelizeInstance', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeInstance.handlebars',
    outputPath: './src/data/index.ts',
    overwriteExisting: true,
    languageType: 'sequelize',
    mode: 'schema',
    onFileEmitted: lintAndPretty
  }),
  new cradle.EmitterOptions('sequelizeModels', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/sequelizeModel.handlebars',
    outputPath: './src/data/models/{{Name}}.ts',
    overwriteExisting: true,
    languageType: 'sequelize',
    onFileEmitted: lintAndPretty
  }),
  new cradle.EmitterOptions('serviceBase', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/serviceBase.handlebars',
    outputPath: './src/api/services/{{Name}}ServiceBase.ts',
    overwriteExisting: true,
    languageType: 'ts',
    onFileEmitted: lintAndPretty
  }),
  new cradle.EmitterOptions('service', '@gatewayapps/cradle-template-emitter', {
    sourcePath: './cradle/templates/service.handlebars',
    outputPath: './src/api/services/{{Name}}Service.ts',
    overwriteExisting: false,
    languageType: 'ts'
  })
]

module.exports = new cradle.CradleConfig(loaderOptions, emitterOptions)
