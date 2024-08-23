import { Router } from 'express';

import { authMiddleware, authPermissionMiddleware } from '@src/middlewares';
import { PermissionRoles } from '@src/models/Workspace';

import { handleResponse } from '@utils/index';

import { NotificationService } from '../notification/services';
import { PredicateVersionService } from '../predicateVersion/services';
import { TransactionService } from '../transaction/services';
import { UserService } from '../user/service';
import { PredicateController } from './controller';
import { PredicateService } from './services';
import { validateAddPredicatePayload } from './validations';

const router = Router();
const predicateService = new PredicateService();
const predicateVersionService = new PredicateVersionService();
const userService = new UserService();
const transactionService = new TransactionService();
const notificationService = new NotificationService();
const {
  create,
  findById,
  findByName,
  list,
  findByAddress,
  delete: deleteService,
  hasReservedCoins,
} = new PredicateController(
  userService,
  predicateService,
  predicateVersionService,
  transactionService,
  notificationService,
);

router.use(authMiddleware);

router.post(
  '/',
  validateAddPredicatePayload,
  authPermissionMiddleware([
    PermissionRoles.OWNER,
    PermissionRoles.ADMIN,
    PermissionRoles.MANAGER,
  ]),
  handleResponse(create),
);
router.get('/', handleResponse(list));
router.get('/:predicateId', handleResponse(findById));
router.get('/by-name/:name', handleResponse(findByName));
router.get('/reserved-coins/:predicateId', handleResponse(hasReservedCoins));
router.get('/by-address/:address', handleResponse(findByAddress));

export default router;
