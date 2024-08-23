import type { IAuthRequest } from '@middlewares/auth/types';

import { TokenUtils } from '@src/utils/token/utils';
import type { AuthStrategy } from './type';

export class TokenAuthStrategy implements AuthStrategy {
  async authenticate(
    req: IAuthRequest,
  ): Promise<{ user: any; workspace: any }> {
    const signature = req.headers.authorization;
    const token = await TokenUtils.recoverToken(signature);
    await TokenUtils.renewToken(token);

    return { user: token.user, workspace: token.workspace };
  }
}
