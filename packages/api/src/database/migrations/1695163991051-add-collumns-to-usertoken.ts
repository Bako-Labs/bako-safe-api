import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const cExpired = new TableColumn({
  name: 'expired_at',
  type: 'timestamp',
  isNullable: true,
});

const cEncoder = new TableColumn({
  name: 'encoder',
  type: 'varchar',
});

const cProvider = new TableColumn({
  name: 'provider',
  type: 'varchar',
});

export class addCollumnsToUsertoken1695163991051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_tokens', [
      cExpired,
      cEncoder,
      cProvider,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_tokens', [
      cExpired,
      cEncoder,
      cProvider,
    ]);
  }
}
