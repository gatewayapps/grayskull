const packageInfo = require('./package.json')
const fetch = require('isomorphic-fetch')
const fs = require('fs-extra')

const RELASE_NOTES_URL = `https://parcelapp.io/api/projects/5bc65fb88f171e07f26fdd55/notes/format/html?raw=true&version=${packageInfo.version}&scope=major`
try {
	fetch(RELASE_NOTES_URL)
		.then((response) => {
			return response.text().then((textData) => {
				fs.writeFileSync('./public/releaseNotes.html', textData, { encoding: 'utf8' })
			})
		})
		.catch((err) => {
			console.error(err)
		})
} catch (err) {}
