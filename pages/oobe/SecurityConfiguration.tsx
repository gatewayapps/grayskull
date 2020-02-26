import React from 'react'
import SecurityConfigurationForm, {
	ISecurityConfigurationFormProps
} from '../../presentation/components/SecurityConfigurationForm'

export interface OobeSecurityConfigurationProps extends ISecurityConfigurationFormProps {
	stepIndex: number
}

export const SecurityConfiguration = (props) => {
	const onValidated = (isValid, errors) => {
		props.onValidationChanged(props.stepIndex, isValid, errors)
	}
	return (
		<SecurityConfigurationForm
			data={props.data}
			onConfigurationChanged={props.onConfigurationChanged}
			onValidated={onValidated}
		/>
	)
}

export default SecurityConfiguration
