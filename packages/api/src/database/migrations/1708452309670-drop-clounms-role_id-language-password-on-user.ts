import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class dropClounmsRoleIdLanguagePasswordOnUser1708452309670
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role_id');
    await queryRunner.dropColumn('users', 'language');
    await queryRunner.dropColumn('users', 'password');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'language',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'role_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);
  }
}
