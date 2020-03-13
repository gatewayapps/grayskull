import React from 'react'
const releaseNotes = require('../public/releaseNotes.txt').default

export default () => {
	return <div dangerouslySetInnerHTML={{ __html: releaseNotes }} />
}
