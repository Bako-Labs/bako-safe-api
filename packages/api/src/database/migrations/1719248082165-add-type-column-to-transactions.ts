import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const cType = new TableColumn({
  name: 'type',
  type: 'varchar',
  isNullable: false,
  default: `'TRANSACTION_SCRIPT'`,
});

export class AddTypeColumnToTransactions1719248082165
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transactions', cType);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', cType);
  }
}
