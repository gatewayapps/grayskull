import React from 'react'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import gql from 'graphql-tag'
import { useLazyQuery } from 'react-apollo'

const BACKUP_CONFIGURATION_QUERY = gql`
  query BACKUP_CONFIGURATION_QUERY {
    backupConfiguration {
      success
      downloadUrl
    }
  }
`

const BackupPage = (props) => {
  const [query, { data, loading }] = useLazyQuery(BACKUP_CONFIGURATION_QUERY, { fetchPolicy: 'network-only' })
  if (data && data.backupConfiguration && data.backupConfiguration.success) {
    window.location.replace(data.backupConfiguration.downloadUrl)
  }

  return (
    <AuthenticatedRoute permission={Permissions.Admin}>
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h4>Backup and Restore</h4>
          </div>
          <div className="card-body">
            <p>
              <p className="card-text">
                Download an encrypted backup of your Grayskull configuration. This includes users, clients,
                authorizations and settings.
              </p>
              <button
                disabled={loading}
                role="button"
                onClick={() => {
                  query()
                }}
                className="btn btn-success">
                {loading ? (
                  <>
                    <i className="fa fa-fw fa-spin fa-spinner" /> Backing Up...
                  </>
                ) : (
                  <>
                    <i className="fa fa-fw fa-download" /> Backup Configuration
                  </>
                )}
              </button>
            </p>
            <hr />
            <p>
              <p className="card-text">
                Restore your configuration from an encrypted backup. Your global Grayskull secret must match the secret
                used at the time of backup.
              </p>
            </p>
          </div>
        </div>
      </div>
    </AuthenticatedRoute>
  )
}

export default BackupPage
