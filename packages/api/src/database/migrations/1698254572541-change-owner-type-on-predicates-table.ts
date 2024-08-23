import {
  type MigrationInterface,
  type QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const colPredicateOwner = new TableColumn({
  name: 'owner_id',
  type: 'uuid',
  isNullable: false,
});

const fkPredicateOwner = new TableForeignKey({
  name: 'FK-predicate-owner',
  columnNames: ['owner_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'users',
  onDelete: 'CASCADE',
});

export class changeOwnerTypeOnPredicatesTable1698254572541
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('predicates', 'owner');
    await queryRunner.addColumn('predicates', colPredicateOwner);
    await queryRunner.createForeignKey('predicates', fkPredicateOwner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('predicates', fkPredicateOwner);
    await queryRunner.dropColumn('predicates', colPredicateOwner);
    await queryRunner.addColumn(
      'predicates',
      new TableColumn({
        name: 'owner',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
