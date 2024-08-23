import { Address } from 'fuels';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAddressTypePredicate1722946398593
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Migration ChangeAddressTypePredicate1722946398593');
    const predicates = await queryRunner.query(
      `SELECT * FROM predicates p WHERE p."predicateAddress" LIKE 'fuel%'`,
    );

    for (const predicate of predicates) {
      const newAddress = Address.fromString(
        predicate.predicateAddress,
      ).toHexString();

      // Verificar se o novo endereço já existe no banco de dados
      const existingPredicate = await queryRunner.query(
        `SELECT id FROM predicates WHERE "predicateAddress" = $1`,
        [newAddress],
      );

      if (existingPredicate.length === 0) {
        await queryRunner.query(
          `UPDATE predicates SET "predicateAddress" = $1 WHERE id = $2`,
          [newAddress, predicate.id],
        );
        console.log(newAddress, predicate.id);
      }
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
