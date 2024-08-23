import type { MigrationInterface, QueryRunner } from 'typeorm';

export class updateIconUrl1709226500194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          UPDATE users
          SET avatar = concat('${process.env.ASSETS_URL}', '/users/', floor(random() * 1500)::int::varchar, '.jpg')
    `,
    );
    await queryRunner.query(
      `
          UPDATE workspace
          SET avatar = concat('${process.env.ASSETS_URL}', '/workspaces/', floor(random() * 1500)::int::varchar, '.jpg')
    `,
    );
  }

  public async down(): Promise<void> {
    return;
  }
}
