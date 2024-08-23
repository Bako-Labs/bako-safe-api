import { Address } from 'fuels';

import type { Database } from '@/lib';

type GetApiToken = {
  apiToken: string;
  userId: string;
};

export class AuthService {
  constructor(private db: Database) {}

  async getSession(apiToken: string, userId: string) {
    const { vaultId, tokenConfig, userAddress } = await this.getTokenData({
      apiToken,
      userId,
    });
    const { code, codeId } = await this.createSession(userId);
    return {
      vaultId,
      userAddress,
      tokenConfig,
      code: {
        value: code,
        id: codeId,
      },
    };
  }

  async getTokenData(params: GetApiToken) {
    const { apiToken, userId } = params;

    const query = `
      SELECT api_tokens.predicate_id,
             users.address,
             predicates.provider,
             api_tokens.config
      FROM api_tokens
               INNER JOIN predicates ON api_tokens.predicate_id = predicates.id
               INNER JOIN predicate_members ON api_tokens.predicate_id = predicate_members.predicate_id
               INNER JOIN workspace_users ON workspace_users.workspace_id = predicates.workspace_id
               INNER JOIN users ON workspace_users.user_id = users.id
      WHERE api_tokens.token = $1
        AND api_tokens.deleted_at IS null
        AND (predicate_members.user_id = $2 OR
             workspace_users.user_id = $2)
      LIMIT 1;
       `;

    const result = await this.db.query(query, [apiToken, userId]);

    if (!result || !result.predicate_id) {
      throw new Error('Invalid token');
    }

    return {
      vaultId: result.predicate_id,
      provider: result.provider,
      userAddress: result.address,
      tokenConfig: result.config,
    };
  }

  async createSession(user: string) {
    const code = `cli${Address.fromRandom().toB256()}`;
    const query = `
      INSERT INTO recover_codes(origin, type, owner, code, used, valid_at, metadata)
      VALUES ('CLI', 'AUTH_ONCE', $1, $2, false, NOW() + INTERVAL '2 minutes', $3)
      RETURNING id;
    `;
    const result = await this.db.query(query, [
      user,
      code,
      JSON.stringify({ uses: 0 }),
    ]);
    return { code, codeId: result.id };
  }

  async closeSession(id: string) {
    const query = `
      UPDATE recover_codes
      SET used = true
      WHERE id = $1 AND used = false
    `;
    await this.db.query(query, [id]);
  }

  get database() {
    return this.db;
  }
}
