import React, { useState } from 'react'
import { SAVE_CONFIGURATION } from '../../oobe'

import RequireConfiguration from '../../../client/components/RequireConfiguration'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import { Permissions } from '../../../server/utils/permissions'
import { IConfiguration } from '../../../server/data/models/IConfiguration'
import SecurityConfigurationForm from '../../../client/components/SecurityConfigurationForm'
import LoadingIndicator from '../../../client/components/LoadingIndicator'
import MutationButton from '../../../client/components/MutationButton'

const SecurityComponent = (props) => {
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
              const SecurityConfiguration = configuration.Security
              return (
                <div className="card">
                  <div className="card-body">
                    <SecurityConfigurationForm
                      data={SecurityConfiguration}
                      onConfigurationChanged={(data) => {
                        setLocalConfiguration({
                          Mail: configuration.Mail,
                          Server: configuration.Server,
                          Security: data
                        })
                      }}
                      onValidated={(isValid, errors) => {
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
                      variables={{ configuration: { Security: localConfiguration.Security } }}
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

export default SecurityComponent
