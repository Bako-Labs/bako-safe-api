import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class removeAbiAndBytesColumnsFromPredicates1714758157635
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('predicates', 'abi');
    await queryRunner.dropColumn('predicates', 'bytes');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'predicates',
      new TableColumn({
        name: 'abi',
        type: 'varchar',
      }),
    );
    await queryRunner.addColumn(
      'predicates',
      new TableColumn({
        name: 'bytes',
        type: 'varchar',
      }),
    );
  }
}
