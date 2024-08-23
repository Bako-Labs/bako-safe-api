import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class createTableTransactions1694536141266
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
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
            name: 'predicate_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'hash',
            type: 'varchar',
          },
          {
            name: 'tx_data',
            type: 'jsonb',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'sendTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'gasUsed',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'resume',
            type: 'jsonb',
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
            name: 'FK-predicate-transactions',
            columnNames: ['predicate_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'predicates',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
