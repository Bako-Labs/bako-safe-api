import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class changeTypesOnUsersTable1695928860225
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'name');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'active');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'active',
        type: 'boolean',
        default: true,
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'email');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'password');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'language');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'language',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'role_id');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('users', 'address');
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'address');
    await queryRunner.dropColumn('users', 'role_id');
    await queryRunner.dropColumn('users', 'language');
    await queryRunner.dropColumn('users', 'email');
    await queryRunner.dropColumn('users', 'active');
    await queryRunner.dropColumn('users', 'name');
    await queryRunner.dropColumn('users', 'password');

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'active',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'language',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role_id',
        type: 'uuid',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'address',
        type: 'varchar',
      }),
    );
  }
}
