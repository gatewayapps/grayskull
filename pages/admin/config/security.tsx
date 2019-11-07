import React, { useState } from 'react'
import { SAVE_CONFIGURATION } from '../../oobe'
import { useMutation } from '@apollo/react-hooks'
import RequireConfiguration from '../../../client/components/RequireConfiguration'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import { Permissions } from '../../../server/utils/permissions'
import { IConfiguration } from '../../../server/data/models/IConfiguration'
import SecurityConfigurationForm from '../../../client/components/SecurityConfigurationForm'
import LoadingIndicator from '../../../client/components/LoadingIndicator'

const SecurityComponent = (props) => {
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
              const SecurityConfiguration = configuration.Security
              return (
                <div className="card">
                  <div className="card-body">
                    <SecurityConfigurationForm
                      data={SecurityConfiguration}
                      onConfigurationChanged={(data) => {
                        setLocalConfiguration({ Mail: configuration.Mail, Server: configuration.Server, Security: data })
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
                        saveConfiguration({ variables: { configuration: { Security: localConfiguration.Security } } })
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

export default SecurityComponent
