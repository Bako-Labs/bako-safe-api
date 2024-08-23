import type { IAuthRequest } from '@middlewares/auth/types';
import { RecoverCode, RecoverCodeType, Workspace } from '@src/models';
import {
  ErrorTypes,
  Unauthorized,
  UnauthorizedErrorTitles,
} from '@utils/error';

import type { AuthStrategy, IValidatePathParams } from './type';

export class CodeAuthStrategy implements AuthStrategy {
  async authenticate(req: IAuthRequest) {
    const signature = req?.headers?.authorization;
    const recover = await RecoverCode.findOne({
      where: {
        code: signature,
        type: RecoverCodeType.AUTH_ONCE,
      },
      relations: ['owner'],
    });

    if (!recover) {
      throw new Unauthorized({
        type: ErrorTypes.Unauthorized,
        title: UnauthorizedErrorTitles.INVALID_RECOVER_CODE,
        detail: 'The provided recover code is invalid',
      });
    }

    const isOld = recover.validAt < new Date();
    const isUsed = recover.used;

    if (isOld || isUsed) {
      throw new Unauthorized({
        type: ErrorTypes.Unauthorized,
        title: UnauthorizedErrorTitles.INVALID_RECOVER_CODE,
        detail: 'The provided recover code is expired',
      });
    }

    if (Number(recover.metadata.uses) >= 3) {
      //todo: change this number to dynamic
      recover.used = true;
    }

    recover.metadata.uses = Number(recover.metadata.uses) + 1;
    await recover.save();

    return {
      user: recover.owner,
      workspace: await Workspace.findOne({
        where: {
          owner: recover.owner,
        },
      }),
    };
  }
}

export class CliAuthStrategy extends CodeAuthStrategy implements AuthStrategy {
  private validRoutes = ['GET /predicate', 'POST /transaction'];

  async authenticate(req: IAuthRequest) {
    const authentication = await super.authenticate(req);

    this.validatePath({
      path: req.originalUrl,
      method: req.method,
    });

    return authentication;
  }

  private validatePath(params: IValidatePathParams) {
    const isAuthorized = this.validRoutes.some((route) => {
      const [method, path] = route.split(' ');
      return method === params.method && params.path.includes(path);
    });

    if (!isAuthorized) {
      throw new Unauthorized({
        type: ErrorTypes.Unauthorized,
        title: UnauthorizedErrorTitles.UNAUTHORIZED_RESOURCE,
        detail: 'The provided resource is unauthorized',
      });
    }
  }
}
