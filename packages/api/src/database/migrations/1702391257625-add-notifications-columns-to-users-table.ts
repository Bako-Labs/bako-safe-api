import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const cnotify = new TableColumn({
  name: 'notify',
  type: 'boolean',
  default: false,
});

const cFirstLogin = new TableColumn({
  name: 'first_login',
  type: 'boolean',
  default: true,
});

export class addNotificationsColumnsToUsersTable1702391257625
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [cFirstLogin, cnotify]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [cnotify, cFirstLogin]);
  }
}
