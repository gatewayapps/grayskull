const _ = require('lodash')
const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')
module.exports = new cradle.EmitterOptions(
  'apollo',
  '@gatewayapps/cradle-apollo-emitter',
  {
    outputDirectory: './src/data/graphql/',
    outputType: 'typescript',
    shouldOutputResolverFiles: false,
    isModelTopLevel: (model) => {
      return model.Meta !== undefined && model.Meta.topLevel
    },
    shouldGenerateResolvers: (model) => {
      return model.Meta !== undefined && model.Meta.topLevel && !['Session', 'UserClient'].includes(model.Name)
    },
    shouldTypeIncludeProperty: (model, propertyName, propertyType) => (!utils.isFieldSensitive(model, propertyName)),
    shouldTypeIncludeReference: (model, referenceName, referenceType) => (!utils.isFieldSensitive(model, referenceName)),
    overwriteExisting: true,
    verbose: true,
    onComplete: utils.lintAndPretty,
    registerCustomHelpers: utils.registerHandleBarHelpers
  },
  console
)
