import { Router } from 'express';

import { authMiddleware, authPermissionMiddleware } from '@src/middlewares';
import { PermissionRoles } from '@src/models/Workspace';
import { handleResponse } from '@src/utils';

import { WorkspaceController } from './controller';
import {
  PayloadCreateWorkspaceSchema,
  PayloadUpdatePermissionsWorkspaceSchema,
  PayloadUpdateWorkspaceParams,
  PayloadUpdateWorkspaceSchema,
} from './validations';

const router = Router();
const workspaceController = new WorkspaceController();

router.use(authMiddleware);

router.get('/by-user', handleResponse(workspaceController.listByUser));

router.get(
  '/balance',
  authPermissionMiddleware([
    PermissionRoles.OWNER,
    PermissionRoles.ADMIN,
    PermissionRoles.MANAGER,
    PermissionRoles.VIEWER,
  ]),
  handleResponse(workspaceController.fetchPredicateData),
);

router.post(
  '/',
  PayloadCreateWorkspaceSchema,
  handleResponse(workspaceController.create),
);

router.get('/:id', handleResponse(workspaceController.findById));

router.put(
  '/',
  PayloadUpdateWorkspaceSchema,
  authPermissionMiddleware([PermissionRoles.OWNER, PermissionRoles.ADMIN]),
  handleResponse(workspaceController.update),
);

router.put(
  '/permissions/:member',
  PayloadUpdateWorkspaceParams,
  PayloadUpdatePermissionsWorkspaceSchema,
  authPermissionMiddleware([PermissionRoles.OWNER, PermissionRoles.ADMIN]),
  handleResponse(workspaceController.updatePermissions),
);

router.post(
  '/members/:member/remove',
  PayloadUpdateWorkspaceParams,
  authPermissionMiddleware([PermissionRoles.OWNER, PermissionRoles.ADMIN]),
  handleResponse(workspaceController.removeMember),
);
router.post(
  '/members/:member/include',
  PayloadUpdateWorkspaceParams,
  authPermissionMiddleware([PermissionRoles.OWNER, PermissionRoles.ADMIN]),
  handleResponse(workspaceController.addMember),
);
export default router;
