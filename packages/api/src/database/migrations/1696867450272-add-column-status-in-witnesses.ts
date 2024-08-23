import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class addColumnStatusInWitnesses1696867450272
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'witnesses',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
        default: "'PENDING'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('witnesses', 'status');
  }
}
