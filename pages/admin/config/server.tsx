import React, { useState } from 'react'
import { SAVE_CONFIGURATION } from '../../oobe'
import { useMutation } from '@apollo/react-hooks'
import RequireConfiguration from '../../../client/components/RequireConfiguration'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import { Permissions } from '../../../server/utils/permissions'
import { IConfiguration } from '../../../server/data/models/IConfiguration'
import ServerConfigurationForm from '../../../client/components/ServerConfigurationForm'
import LoadingIndicator from '../../../client/components/LoadingIndicator'

const serverComponent = (props) => {
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
              const serverConfiguration = configuration.Server
              return (
                <div className="card">
                  <div className="card-body">
                    <ServerConfigurationForm
                      data={serverConfiguration}
                      onConfigurationChanged={(data) => {
                        setLocalConfiguration({ Mail: configuration.Mail, Security: configuration.Security, Server: data })
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
                        saveConfiguration({ variables: { configuration: { Server: localConfiguration.Server } } })
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

export default serverComponent
