import React from 'react'
import { any } from 'bluebird'

const ConfigurationContext = React.createContext({
	Mail: any,
	Server: any,
	Security: any,
	HeaderItems: any
})

export default ConfigurationContext
