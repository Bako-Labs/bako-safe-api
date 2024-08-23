import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const colWorkspace = new TableColumn({
  name: 'owner_id',
  type: 'uuid',
  isNullable: true,
});

const oldFK = new TableForeignKey({
  name: 'FK-contact-created_by',
  columnNames: ['created_by'],
  referencedColumnNames: ['id'],
  referencedTableName: 'users',
  onDelete: 'CASCADE',
});

const fkWorkspaceAddressBook = new TableForeignKey({
  name: 'FK-workspace-address_book',
  columnNames: ['owner_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'workspace',
  onDelete: 'CASCADE',
});

export class changeAddressBookAddPk1703083669692 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('address_book', oldFK);
    await queryRunner.dropColumn('address_book', 'created_by');

    await queryRunner.addColumn('address_book', colWorkspace);
    await queryRunner.createForeignKey('address_book', fkWorkspaceAddressBook);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('address_book', fkWorkspaceAddressBook);
    await queryRunner.dropColumn('address_book', colWorkspace);

    await queryRunner.createForeignKey('address_book', oldFK);
  }
}
