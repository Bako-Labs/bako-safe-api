import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class addPredicateMembersTable1698173551420
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'predicate_members',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'predicate_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
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
    await queryRunner.dropTable('predicate_members');
  }
}
