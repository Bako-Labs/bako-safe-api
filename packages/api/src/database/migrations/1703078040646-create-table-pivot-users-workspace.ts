import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class createTablePivotUsersWorkspace1703078040646
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'workspace_users',
        columns: [
          {
            name: 'workspace_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'FK-workspace-workspace_users',
            columnNames: ['workspace_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workspace',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK-user-workspace_users',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('workspace_users');
  }
}
