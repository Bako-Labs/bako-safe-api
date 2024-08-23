import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const cProvider = new TableColumn({
  name: 'provider',
  type: 'varchar',
});

const cUsers = new TableColumn({
  name: 'address',
  type: 'varchar',
});

export class addParoviderAndConnectedToUsers1695162520664
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [cProvider, cUsers]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [cProvider, cUsers]);
  }
}
