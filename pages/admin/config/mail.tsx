import React, { useState } from 'react'
import { SAVE_CONFIGURATION } from '../../oobe'

import RequireConfiguration from '../../../presentation/components/RequireConfiguration'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import { Permissions } from '../../../foundation/constants/permissions'
import { IConfiguration } from '../../../foundation/models/IConfiguration'
import MailConfigurationForm from '../../../presentation/components/ConfigurationForms/MailConfigurationForm'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'
import MutationButton from '../../../presentation/components/MutationButton'

const MailComponent = () => {
	const [localConfiguration, setLocalConfiguration] = useState<IConfiguration | undefined>()
	const [saveEnabled, setSaveEnabled] = useState(false)
	return (
		<AuthenticatedRoute permission={Permissions.Admin}>
			<div className="container">
				<RequireConfiguration>
					{(configuration: IConfiguration) => {
						if (!localConfiguration) {
							setLocalConfiguration(configuration)
							return <LoadingIndicator message="Loading configuration..." />
						} else {
							const MailConfiguration = configuration.Mail!
							return (
								<div className="card">
									<div className="card-body">
										<MailConfigurationForm
											data={MailConfiguration}
											onConfigurationChanged={(data) => {
												setLocalConfiguration({
													Security: configuration.Security,
													Server: configuration.Server,
													Mail: data
												})
											}}
											onValidated={(isValid) => {
												setSaveEnabled(isValid)
											}}
										/>
									</div>
									<div className="card-footer">
										<MutationButton
											busyContent={
												<>
													<i className="fa fa-spin fa-spinner fa-fw" /> Saving
												</>
											}
											content={
												<>
													<i className="fa fa-save fa-fw" /> Save
												</>
											}
											className="float-right btn btn-primary"
											disabled={!saveEnabled}
											mutation={SAVE_CONFIGURATION}
											variables={{
												configuration: {
													Mail: {
														...localConfiguration.Mail,
														port: parseInt(localConfiguration.Mail!.port!.toString())
													}
												}
											}}
										/>
									</div>
								</div>
							)
						}
					}}
				</RequireConfiguration>
			</div>
		</AuthenticatedRoute>
	)
}

export default MailComponent
