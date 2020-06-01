import migrations from '../../../foundation/migrations'

export class MigrationSource {
	public async getMigrations() {
		return migrations.map((m) => m.name)
	}
	public getMigrationName(migrationName: string) {
		return migrationName
	}
	public getMigration(migrationName) {
		const migration = migrations.find((m) => m.name === migrationName)
		return migration
	}
}
