import React from 'react'

const UserContext = React.createContext({
  refresh: undefined,
  user: undefined
})

export default UserContext
