import React from 'react'

const UserContext = React.createContext<{ refresh: any; user: any; hasInitialized: any }>({
	refresh: undefined,
	user: undefined,
	hasInitialized: false
})

export default UserContext
