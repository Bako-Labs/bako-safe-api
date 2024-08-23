import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const colUserTransactions = new TableColumn({
  name: 'created_by',
  type: 'uuid',
  isNullable: true,
});

const fkUserTransactions = new TableForeignKey({
  name: 'FK-transactions-created_by',
  columnNames: ['created_by'],
  referencedColumnNames: ['id'],
  referencedTableName: 'users',
  onDelete: 'CASCADE',
});

export class createdByTransaction1695662424610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transactions', colUserTransactions);
    await queryRunner.createForeignKey('transactions', fkUserTransactions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', fkUserTransactions);
    await queryRunner.dropColumn('transactions', colUserTransactions);
  }
}
