import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const colWorkspace = new TableColumn({
  name: 'workspace_id',
  type: 'uuid',
  isNullable: true,
});

const fkWorkspacePredicate = new TableForeignKey({
  name: 'FK-workspace-predicate',
  columnNames: ['workspace_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'workspace',
  onDelete: 'CASCADE',
});

export class addColumnWorkspaceInPredicates1703076380933
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('predicates', colWorkspace);
    await queryRunner.createForeignKey('predicates', fkWorkspacePredicate);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('predicates', fkWorkspacePredicate);
    await queryRunner.dropColumn('predicates', colWorkspace);
  }
}
