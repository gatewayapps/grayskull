import React from 'react'

const UserContext = React.createContext({
  refresh: undefined,
  user: undefined,
  hasInitialized: false
})

export default UserContext
