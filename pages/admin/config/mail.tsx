import React, { useState } from 'react'
import { SAVE_CONFIGURATION } from '../../oobe'
import { useMutation } from '@apollo/react-hooks'
import RequireConfiguration from '../../../client/components/RequireConfiguration'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import { Permissions } from '../../../server/utils/permissions'
import { IConfiguration } from '../../../server/data/models/IConfiguration'
import MailConfigurationForm from '../../../client/components/MailConfigurationForm'
import LoadingIndicator from '../../../client/components/LoadingIndicator'

const MailComponent = (props) => {
  const [localConfiguration, setLocalConfiguration] = useState<IConfiguration | undefined>()
  const [saveEnabled, setSaveEnabled] = useState(false)
  const [saveConfiguration, { loading, data, error }] = useMutation(SAVE_CONFIGURATION)
  return (
    <AuthenticatedRoute permission={Permissions.Admin}>
      <div className="container">
        <RequireConfiguration>
          {(configuration: IConfiguration) => {
            if (!localConfiguration) {
              setLocalConfiguration(configuration)
              return <LoadingIndicator message="Loading configuration..." />
            } else {
              const MailConfiguration = configuration.Mail
              return (
                <div className="card">
                  <div className="card-body">
                    <MailConfigurationForm
                      data={MailConfiguration}
                      onConfigurationChanged={(data) => {
                        setLocalConfiguration({ Security: configuration.Security, Server: configuration.Server, Mail: data })
                      }}
                      onValidated={(isValid, errors) => {
                        setSaveEnabled(isValid)
                      }}
                    />
                  </div>
                  <div className="card-footer">
                    <button
                      className="float-right btn btn-primary"
                      disabled={!saveEnabled}
                      onClick={() => {
                        setSaveEnabled(false)
                        saveConfiguration({ variables: { configuration: { Mail: localConfiguration.Mail } } })
                      }}>
                      Save
                    </button>
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
