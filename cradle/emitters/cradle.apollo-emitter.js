const cradle = require('@gatewayapps/cradle')
const ApolloEmitter = require('@gatewayapps/cradle-apollo-emitter')
const utils = require('./utils')

module.exports = new cradle.EmitterOptions(
  'apollo',
  new ApolloEmitter({
    outputDirectory: './src/data/graphql/',
    outputType: 'typescript',
    shouldOutputResolverFiles: false,
    shouldEmitModel: (model) => {
      return model.Meta !== undefined && model.Meta.graphql === true
    },
    shouldGenerateResolvers: (model) => {
      return model.Meta !== undefined && model.Meta.graphqlResolvers === true && !['Session', 'UserClient'].includes(model.Name)
    },
    shouldTypeIncludeProperty: (model, propertyName, propertyType) => (!utils.isFieldSensitive(model, propertyName)),
    shouldTypeIncludeReference: (model, referenceName, referenceType) => (!utils.isFieldSensitive(model, referenceName)),
    overwriteExisting: true,
    verbose: true,
    onComplete: utils.lintAndPretty,
    registerCustomHelpers: utils.registerHandleBarHelpers
  }, console)
)
