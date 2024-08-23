import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
} from 'typeorm';

export class removeAddressesColumnFromVaultTemplatesTable1698410413528
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('vault_template', 'addresses');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'vault_template',
      new TableColumn({
        name: 'addresses',
        type: 'text',
      }),
    );
  }
}
