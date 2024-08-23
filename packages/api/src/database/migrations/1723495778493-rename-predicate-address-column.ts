import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePredicateAddressColumn1723495778493
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'predicates',
      'predicateAddress',
      'predicate_address',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'predicates',
      'predicate_address',
      'predicateAddress',
    );
  }
}
