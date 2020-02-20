const cp = require('child_process')
const packageInfo = require('./package.json')

const RELASE_NOTES_URL = `https://parcelapp.io/api/projects/5bc65fb88f171e07f26fdd55/notes/format/html?raw=true&version=${packageInfo.version}&scope=major`
console.log(RELASE_NOTES_URL)
cp.execSync(`curl '${RELASE_NOTES_URL}' > ./public/releaseNotes.html`, { stdio: 'ignore' })
