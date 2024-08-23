import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

export class addColumnPivotPredicteDapp1699531391829
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'apps_connected',
        columns: [
          {
            name: 'dapp_id',
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
            name: 'FK-predicate-apps_connected',
            columnNames: ['predicate_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'predicates',
            onDelete: 'CASCADE',
          },
          {
            name: 'FK-dapp-apps_connected',
            columnNames: ['dapp_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'dapp',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apps_connected');
  }
}
