import React from 'react'
import ServerConfigurationForm, { IServerConfigurationFormProps } from '../../presentation/components/ServerConfigurationForm'

export interface OobeServerConfigurationProps extends IServerConfigurationFormProps {
  stepIndex: number
}

export const ServerConfiguration = (props) => {
  const onValidated = (isValid, errors) => {
    props.onValidationChanged(props.stepIndex, isValid, errors)
  }
  return <ServerConfigurationForm data={props.data} onConfigurationChanged={props.onConfigurationChanged} onValidated={onValidated} />
}

export default ServerConfiguration
