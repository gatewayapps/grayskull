
const Path = require('path')
const childProcess = require('child_process')

module.exports = {
  lintAndPretty(filePaths) {
    if(Array.isArray(filePaths)){
      filePaths  = filePaths.filter(p=>['.ts', '.js'].includes(Path.extname(p)))
      if(filePaths.length > 0){
    const tsFiles = filePaths.filter(p=>Path.extname(p) === '.ts')
    if(tsFiles.length > 0){
    childProcess.execSync(`node ./node_modules/tslint/bin/tslint --fix ${filePaths.join(' ')}`)
    }
    if (filePaths.length > 1) {
      childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "{${filePaths.join(',')}}"`)
    } else if (filePaths.length === 1) {
      childProcess.execSync(`node ./node_modules/prettier/bin-prettier --write "${filePaths[0]}"`)
    }
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
