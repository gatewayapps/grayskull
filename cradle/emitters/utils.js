
const childProcess = require('child_process')
const _ = require('lodash')
const Path = require('path')
const pluralize = require('pluralize')

module.exports = {
  lintAndPretty(filePaths) {
    if (Array.isArray(filePaths)) {
      filePaths = filePaths.filter((p) => ['.ts', '.js'].includes(Path.extname(p)))
      if (filePaths.length > 0) {
        const tsFiles = filePaths.filter((p) => Path.extname(p) === '.ts')
        if (tsFiles.length > 0) {
          // childProcess.execSync(`node ./node_modules/tslint/bin/tslint --fix ${filePaths.join(' ')}`)
          childProcess.execSync(`npx tslint --fix ${filePaths.join(' ')}`)
        }
        if (filePaths.length > 1) {
          childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "{${filePaths.join(',')}}"`)
        } else if (filePaths.length === 1) {
          childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "${filePaths[0]}"`)
        }
      }
    }
  },
  isFieldSensitive(model, fieldName) {
    if (!model.Meta || !model.Meta.sensitive) {
      return false
    }
    return model.Meta.sensitive.includes(fieldName)
  },
  registerHandleBarHelpers(registerHelper) {
    registerHelper('toCamelCase', (str) => {
      return _.camelCase(str)
    })

    registerHelper('pluralize', (str) => {
      return pluralize(str)
    })

    registerHelper('hasDefaultValue', (args, options) => {
      return args && args.DefaultValue !== undefined ? options.fn(this) : options.inverse(this)
    })

    registerHelper('isNotSensitive', (propName, meta, options) => {
      if (!meta || !Array.isArray(meta.sensitive)) {
        return options.fn(this)
      }
      return !meta.sensitive.includes(propName) ? options.fn(this) : options.inverse(this)
    })

    registerHelper('getUniqueValue', (val) => {
      if (typeof val === 'string') {
        return `'${val}'`
      } else {
        return val
      }
    })
  }
}
