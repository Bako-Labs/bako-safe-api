import { TransactionStatus } from 'bakosafe';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWitnessesToTransactionResume1722946311869
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //Move witnesses data to resume JSON
    await queryRunner.query(`
        UPDATE transactions
        SET resume = jsonb_set(
          resume,
          '{witnesses}',
          (
            SELECT COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'signature', w.signature,
                  'account', w.account,
                  'status', w.status,
                  'updatedAt', w.updated_at
                )
              ),
              '[]'::jsonb
            )
            FROM witnesses w
            WHERE w.transaction_id = transactions.id
          )
        )
        WHERE status != '${TransactionStatus.SUCCESS}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Extract witnesses data from resume JSON and insert back into witnesses table
    await queryRunner.query(`
        INSERT INTO witnesses (signature, account, status, transaction_id, updated_at)
        SELECT
          witness->>'signature',
          witness->>'account',
          witness->>'status',
          transactions.id,
          witness->>'updatedAt'
        FROM transactions,
        jsonb_array_elements(transactions.resume->'witnesses') as witness
        WHERE transactions.status != '${TransactionStatus.SUCCESS}'
      `);
  }
}
