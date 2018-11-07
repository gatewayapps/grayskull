const _ = require('lodash')
const cradle = require('@gatewayapps/cradle')
const utils = require('./utils')
module.exports = new cradle.EmitterOptions(
  'apollo',
  '@gatewayapps/cradle-apollo-emitter',
  {
    outputDirectory: './src/data/graphql/',
    outputType: 'typescript',
    shouldTypeIncludeProperty: (model, propertyName, propertyType) => (!utils.isFieldSensitive(model, propertyName)),
    shouldTypeIncludeReference: (model, referenceName, referenceType) => (!utils.isFieldSensitive(model, referenceName)),
    modelOutputPath: (modelName) => `./src/data/graphql/types/${modelName}.ts`,
    getResolverForModel: (model, resolverType) => {
      switch (resolverType) {
        case 'Single': {
          return `async (parent, {id}, context, info) => await ${model.Name}Service.get${model.Name}ById(id)`
        }
        case 'Paginated': {
          return `async (parent, {offset, limit}, context, info) => await ${model.Name}Service.get${model.Name}(offset, limit)`
        }
      }
    },
    getImportsForModel: (model) => {
      const referenceNames = Object.keys(model.References)
      return _.uniq(
        referenceNames.map((rn) => {
          return `import ${model.References[rn].ForeignModel}Service from '@services/${model.References[rn].ForeignModel}Service'`
        })
      )
    },
    getRootImports: (topLevelModels) => {
      return _.uniq(
        topLevelModels.map((model) => {
          return `import ${model.Name}Service from '@services/${model.Name}Service'`
        })
      )
    },
    getResolverForReference: (model, referenceName, reference) => {
      return `async (parent, args, context, info) => await ${reference.ForeignModel}Service.get${reference.ForeignModel}ById(parent.${referenceName})`
    },
    overwriteExisting: true,
    verbose: true,
    onComplete: utils.lintAndPretty,
    isModelToplevel: (model) => {
      return !['UserClient'].includes(model.Name)
    },
    registerCustomHelpers: utils.registerHandleBarHelpers
  },
  console
)
