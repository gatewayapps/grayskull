import React from 'react'

export interface MultifactorStatusProps {
  multifactorRequired: boolean
  userAccountId: string
  otpEnabled: boolean
}

const MultifactorStatus: React.FC = () => {
  const [configuring, setConfiguring] = useState(false)
  const []
}
