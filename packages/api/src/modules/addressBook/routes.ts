import { Router } from 'express';

import { authMiddleware, authPermissionMiddleware } from '@src/middlewares';
import { PermissionRoles } from '@src/models/Workspace';

import { handleResponse } from '@utils/index';

import { UserService } from '../user/service';
import { AddressBookController } from './controller';
import { AddressBookService } from './services';
import {
  validateCreateAddressBookPayload,
  validateUpdateAddressBookPayload,
} from './validations';

const router = Router();
const addressBookService = new AddressBookService();
const userService = new UserService();
const {
  create,
  update,
  list,
  delete: deleteContact,
} = new AddressBookController(addressBookService, userService);

router.use(authMiddleware);

router.post(
  '/',
  validateCreateAddressBookPayload,
  authPermissionMiddleware([
    PermissionRoles.OWNER,
    PermissionRoles.ADMIN,
    PermissionRoles.MANAGER,
  ]),
  handleResponse(create),
);
router.put(
  '/:id',
  authPermissionMiddleware([
    PermissionRoles.OWNER,
    PermissionRoles.ADMIN,
    PermissionRoles.MANAGER,
  ]),
  validateUpdateAddressBookPayload,
  handleResponse(update),
);
router.delete('/:id', handleResponse(deleteContact));
router.get('/', handleResponse(list));

export default router;
