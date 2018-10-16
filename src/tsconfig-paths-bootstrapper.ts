import fs from 'fs'
import JSON5 from 'json5'
import path from 'path'
import * as tsConfigPaths from 'tsconfig-paths'

const tsConfigText = fs.readFileSync(path.join(__dirname, '../tsconfig.json'), 'utf8')
const tsConfig = JSON5.parse(tsConfigText)

const baseUrl = './dist'
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
})
