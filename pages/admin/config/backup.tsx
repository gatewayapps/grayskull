import React, { useState } from 'react'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import gql from 'graphql-tag'
import { useLazyQuery, useMutation } from 'react-apollo'
import FileDropArea from '../../../presentation/components/FileDropArea.tsx'
import PrettyBytes from 'pretty-bytes-es5'

const BACKUP_CONFIGURATION_QUERY = gql`
	query BACKUP_CONFIGURATION_QUERY {
		backupConfiguration {
			success
			downloadUrl
		}
	}
`

const RESTORE_CONFIGURATION_MUTATION = gql`
	mutation RESTORE_CONFIGURATION_MUTATION($file: Upload!) {
		restoreConfiguration(file: $file) {
			success
			error
			message
		}
	}
`

const BackupPage = () => {
	const [backupFile, setBackupFile] = useState<File>(undefined)

	const [query, { data, loading }] = useLazyQuery(BACKUP_CONFIGURATION_QUERY, { fetchPolicy: 'network-only' })
	const [restoreConfiguration, { data: restoredData, loading: restoring }] = useMutation(RESTORE_CONFIGURATION_MUTATION)

	if (data && data.backupConfiguration && data.backupConfiguration.success) {
		window.location.replace(data.backupConfiguration.downloadUrl)
	}
	if (restoredData && restoredData.restoreConfiguration && restoredData.restoreConfiguration.success) {
		window.location.reload(true)
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
								used at the time of backup. This will erase all existing configurations in this installation including
								users.
							</p>
							<FileDropArea
								className="mb-4"
								aria-describedby="test"
								onFilesChanged={(files) => {
									if (files.length > 0) {
										setBackupFile(files[0])
									} else {
										setBackupFile(undefined)
									}
								}}
								style={{ padding: '2rem' }}>
								Drop your backup file here or click to browse
								{backupFile && (
									<div className="alert alert-info">
										{backupFile.name} - {PrettyBytes(backupFile.size)}
									</div>
								)}
							</FileDropArea>
							<button
								disabled={!backupFile || restoring}
								onClick={() => {
									restoreConfiguration({ variables: { file: backupFile } })
								}}
								className="btn btn-warning">
								{restoring ? (
									<>
										<i className="fa fa-fw fa-spin fa-spinner" /> Restoring...
									</>
								) : (
									<>
										<i className="fa fa-fw fa-upload" /> Restore Configuration
									</>
								)}
							</button>
						</p>
					</div>
				</div>
			</div>
		</AuthenticatedRoute>
	)
}

export default BackupPage
