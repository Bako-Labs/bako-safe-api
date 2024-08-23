import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const fkWorkspacePredicate = new TableForeignKey({
  name: 'FK-user_token-workspace',
  columnNames: ['workspace_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'workspace',
  onDelete: 'CASCADE',
});

const colWorkspace = new TableColumn({
  name: 'workspace_id',
  type: 'uuid',
});

export class addColumnWorkspaceOnUsertoken1703155001794
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('user_tokens', colWorkspace);
    await queryRunner.createForeignKey('user_tokens', fkWorkspacePredicate);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user_tokens', fkWorkspacePredicate);
    await queryRunner.dropColumn('user_tokens', colWorkspace);
  }
}
