import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

const colSingle = new TableColumn({
  name: 'single',
  type: 'boolean',
});

export class addColumnSingleInWorkspace1703155607667
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('workspace', colSingle);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('workspace', colSingle);
  }
}
