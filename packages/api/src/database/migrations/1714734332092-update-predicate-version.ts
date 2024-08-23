import { PredicateVersion } from '@src/models';
import type { MigrationInterface, QueryRunner } from 'typeorm';
import { predicateVersion } from './1714671990142-add-new-predicate-version';

export class updatePredicateVersion1714734332092 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const defaultPredicateVersion = await queryRunner.manager.findOne(
      PredicateVersion,
      {
        where: {
          code: predicateVersion.code,
        },
      },
    );

    if (defaultPredicateVersion) {
      await queryRunner.query(
        `
          UPDATE predicates
          SET version_id = $1
          WHERE version_id IS NULL
          AND updated_at = updated_at
        `,
        [defaultPredicateVersion.id],
      );
    } else {
      throw new Error('No predicate version found for the given code.');
    }
  }

  public async down(): Promise<void> {
    return;
  }
}
