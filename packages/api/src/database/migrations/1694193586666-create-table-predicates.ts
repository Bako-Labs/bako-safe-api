import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class createTablePredicates1694193586666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'predicates',
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'predicateAddress',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'minSigners',
            type: 'integer',
          },
          {
            name: 'addresses',
            type: 'text',
          },
          {
            name: 'owner',
            type: 'varchar',
          },
          {
            name: 'bytes',
            type: 'varchar',
          },
          {
            name: 'abi',
            type: 'varchar',
          },
          {
            name: 'configurable',
            type: 'varchar',
          },
          {
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'chainId',
            type: 'integer',
            isNullable: true,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('predicates');
  }
}
