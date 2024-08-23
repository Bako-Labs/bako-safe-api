import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class removeColumnUtxoOfColumnAssets1707395773868
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('assets', 'utxo');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'assets',
      new TableColumn({
        name: 'utxo',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
