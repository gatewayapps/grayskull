import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import generateFingerprint from '../utils/generateFingerprint'

const UserContext = React.createContext({
  user: undefined,
  refresh: undefined
})

export default UserContext
