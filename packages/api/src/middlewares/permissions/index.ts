import type { IAuthRequest } from '@middlewares/auth/types';
import {
  PermissionAccess,
  type PermissionRoles,
  Predicate,
  Workspace,
} from '@src/models';
import {
  ErrorTypes,
  NotFound,
  Unauthorized,
  UnauthorizedErrorTitles,
} from '@utils/error';
import type { NextFunction, Request, Response } from 'express';

export interface IPredicatePermissionMiddlewareOptions {
  predicateSelector: (req: Request) => string;
  permissions: PermissionRoles[];
}

export const predicatePermissionMiddleware = (
  options: IPredicatePermissionMiddlewareOptions,
) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const { user, workspace: authWorkspace }: IAuthRequest = req;

      const predicateId = options.predicateSelector(req);
      const predicate = await Predicate.findOne({
        where: { id: predicateId },
        relations: ['workspace'],
      });

      // Require predicate to be found
      if (!predicate) {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Predicate not found',
          detail: `Predicate with id ${predicateId} not found`,
        });
      }

      const { workspace: predicateWorkspace } = predicate;
      const isSameWorkspace = predicateWorkspace.id === authWorkspace.id;
      const isMember = await Workspace.createQueryBuilder('workspace')
        .innerJoin('workspace.members', 'members')
        .where('members.id = :userId', { userId: user.id })
        .andWhere('workspace.id = :workspaceId', {
          workspaceId: predicateWorkspace.id,
        })
        .getExists();

      // Require user to be a member of the workspace and the workspace to be the same as the predicate
      if (!isSameWorkspace || !isMember) {
        throw new Unauthorized({
          type: ErrorTypes.Unauthorized,
          title: UnauthorizedErrorTitles.MISSING_PERMISSION,
          detail: 'You do not have permission to access this resource',
        });
      }

      const userPermission = predicateWorkspace.permissions[user.id];
      const hasPermission = options.permissions.some((role) => {
        const permission = userPermission[role];
        return (
          permission.includes(PermissionAccess.ALL) ||
          permission.includes(predicateId)
        );
      });

      // Require user to have the required permission
      if (!hasPermission) {
        throw new Unauthorized({
          type: ErrorTypes.Unauthorized,
          title: UnauthorizedErrorTitles.MISSING_PERMISSION,
          detail: 'You do not have permission to access this resource',
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
