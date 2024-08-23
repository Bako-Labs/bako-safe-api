import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const cpayload = new TableColumn({
  name: 'payload',
  type: 'text',
});
export class addCollumnToUserToken1695646779754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_tokens', [cpayload]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_tokens', [cpayload]);
  }
}
