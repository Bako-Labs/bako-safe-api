import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class changeColumnVersionIdOfPredicates1714993698973
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'predicates',
      'version_id',
      new TableColumn({
        name: 'version_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'predicates',
      'version_id',
      new TableColumn({
        name: 'version_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }
}
