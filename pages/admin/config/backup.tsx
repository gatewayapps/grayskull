import React from 'react'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'

const BACKUP_CONFIGURATION_QUERY = gql`
  query BACKUP_CONFIGURATION_QUERY {
    backupConfiguration {
      success
      downloadUrl
    }
  }
`

const BackupPage = (props) => {
  const { data, loading } = useQuery(BACKUP_CONFIGURATION_QUERY)

  return (
    <AuthenticatedRoute permission={Permissions.Admin}>
      <div className="container">
        {loading && <LoadingIndicator message="Loading..." />}
        {data && (
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
                <a role="button" href={data.backupConfiguration.downloadUrl} className="btn btn-success">
                  <i className="fa fa-fw fa-download" /> Backup Configuration
                </a>
              </p>
              <hr />
              <p>
                <p className="card-text">
                  Restore your configuration from an encrypted backup. Your global Grayskull secret must match the
                  secret used at the time of backup.
                </p>
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedRoute>
  )
}

export default BackupPage
