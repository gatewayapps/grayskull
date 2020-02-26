import React from 'react'
import MailConfigurationForm, { IMailConfigurationFormProps } from '../../presentation/components/MailConfigurationForm'

export interface OobeMailConfigurationProps extends IMailConfigurationFormProps {
	stepIndex: number
}

export const MailConfiguration = (props) => {
	const onValidated = (isValid, errors) => {
		props.onValidationChanged(props.stepIndex, isValid, errors)
	}
	return (
		<MailConfigurationForm
			data={props.data}
			onConfigurationChanged={props.onConfigurationChanged}
			onValidated={onValidated}
		/>
	)
}

export default MailConfiguration
