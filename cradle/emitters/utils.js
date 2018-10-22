
const childProcess = require('child_process')

module.exports = {
  lintAndPretty(filePaths) {
    if(Array.isArray(filePaths) && filePaths.length > 0){
    childProcess.execSync(`node ./node_modules/tslint/bin/tslint --fix ${filePaths.join(' ')}`)
    if (filePaths.length > 1) {
      childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "{${filePaths.join(',')}}"`)
    } else if (filePaths.length === 1) {
      childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "${filePaths[0]}"`)
    }
  }
  },
  isFieldSensitive (model, fieldName){
    if(!model.Meta || ! model.Meta.sensitive){
      return true
    }
    return model.Meta.sensitive.includes(fieldName)
  }
}
