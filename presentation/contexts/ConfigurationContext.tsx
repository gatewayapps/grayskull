import React from 'react'

const ConfigurationContext = React.createContext<{ Mail: any; Server: any; Security: any; HeaderItems: any }>({
	Mail: undefined,
	Server: undefined,
	Security: undefined,
	HeaderItems: undefined
})

export default ConfigurationContext
