import { query } from 'express';
import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const fkDapp = new TableForeignKey({
  name: 'FK-user-dapp',
  columnNames: ['user'],
  referencedColumnNames: ['id'],
  referencedTableName: 'users',
  onDelete: 'CASCADE',
});

export class addColumnUserOnDapp1713308559624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'dapp',
      new TableColumn({
        name: 'user',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey('dapp', fkDapp);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'dapp');
  }
}
