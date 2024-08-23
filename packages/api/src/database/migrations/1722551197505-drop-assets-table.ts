import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class DropAssetsTable1722551197505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('assets');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'assetId',
            type: 'varchar',
          },
          {
            name: 'transaction_id',
            type: 'uuid',
          },
          {
            name: 'to',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK-transaction-assets',
            columnNames: ['transaction_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'transactions',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }
}
