import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class DropWitnessesTable1722946398592 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('witnesses');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: 'witnesses',
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
            name: 'signature',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'account',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            default: "'PENDING'",
          },
          {
            name: 'transaction_id',
            type: 'uuid',
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
            name: 'FK-transaction-witnesses',
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
