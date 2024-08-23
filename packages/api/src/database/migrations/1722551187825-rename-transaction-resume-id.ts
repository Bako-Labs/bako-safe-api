import { TransactionStatus } from 'bakosafe';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTransactionResumeId1722551187825
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Replace BakoSafeID with id in resume
    await queryRunner.query(`
        UPDATE transactions
        SET resume = jsonb_set(
            resume - 'BakoSafeID',
            '{id}',
            resume->'BakoSafeID'
        )
        WHERE resume ? 'BakoSafeID' 
          AND status != '${TransactionStatus.SUCCESS}'; 
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Replace id with BakoSafeID in resume
    await queryRunner.query(`
        UPDATE transactions
        SET resume = jsonb_set(resume, '{BakoSafeID}', resume->'id') - 'id'
        WHERE resume ? 'id' 
          AND status != '${TransactionStatus.SUCCESS}';
      `);
  }
}
