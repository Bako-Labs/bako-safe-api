import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const colVersion = new TableColumn({
  name: 'version_id',
  type: 'uuid',
  isNullable: true,
});

const fkPredicateVersion = new TableForeignKey({
  name: 'FK-predicate-predicate_version',
  columnNames: ['version_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'predicate_versions',
  onDelete: 'CASCADE',
});

export class addColumnVersionOnPredicates1714683415180
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('predicates', colVersion);
    await queryRunner.createForeignKey('predicates', fkPredicateVersion);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('predicates', fkPredicateVersion);
    await queryRunner.dropColumn('predicates', colVersion);
  }
}
