import type { NextFunction, Request, Response } from 'express';

import type { PermissionRoles } from '@src/models/Workspace';
import { validatePermissionGeneral } from '@src/utils/permissionValidate';

import { ErrorTypes } from '@utils/error';
import {
  Unauthorized,
  UnauthorizedErrorTitles,
} from '@utils/error/Unauthorized';

import { AuthStrategyFactory } from './methods';
import type { IAuthRequest } from './types';

async function authMiddleware(
  req: IAuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const signature = req?.headers?.authorization;

    if (!signature) {
      throw new Unauthorized({
        type: ErrorTypes.Unauthorized,
        title: UnauthorizedErrorTitles.MISSING_CREDENTIALS,
        detail: 'Some required credentials are missing',
      });
    }

    const authStrategy = AuthStrategyFactory.createStrategy(signature);
    const { user, workspace } = await authStrategy.authenticate(req);

    req.user = user;
    req.workspace = workspace;
    return next();
  } catch (e) {
    return next(e);
  }
}

//todo: if required permission to specific vault, check on request this vault ID
function authPermissionMiddleware(permission?: PermissionRoles[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const requestAuth: IAuthRequest = req;

      if (!permission || permission.length === 0) return next();
      const { user, workspace } = requestAuth;

      // if not required info
      if (!user || !workspace) {
        throw new Unauthorized({
          type: ErrorTypes.Unauthorized,
          title: UnauthorizedErrorTitles.MISSING_CREDENTIALS,
          detail: 'Some required credentials are missing',
        });
      }

      // if not required premission info
      if (!workspace.permissions[user.id]) {
        throw new Unauthorized({
          type: ErrorTypes.Unauthorized,
          title: UnauthorizedErrorTitles.MISSING_PERMISSION,
          detail: 'You do not have permission to access this resource',
        });
      }

      if (validatePermissionGeneral(workspace, user.id, permission))
        return next();

      // if not required premissions
      throw new Unauthorized({
        type: ErrorTypes.Unauthorized,
        title: UnauthorizedErrorTitles.MISSING_PERMISSION,
        detail: 'You do not have permission to access this resource',
      });
    } catch (e) {
      return next(e);
    }
  };
}

export { authMiddleware, authPermissionMiddleware };
