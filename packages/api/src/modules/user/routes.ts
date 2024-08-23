import { Router } from 'express';

import { authMiddleware } from '@middlewares/index';

import { handleResponse } from '@utils/index';

import { UserController } from './controller';
import { UserService } from './service';
import {
  FindUserByIDParams,
  PayloadCreateUserSchema,
  PayloadUpdateUserSchema,
} from './validation';

const router = Router();

const userService = new UserService();

const userController = new UserController(userService);

router.get('/nickname/:nickname', handleResponse(userController.validateName));
router.post(
  '/',
  PayloadCreateUserSchema,
  handleResponse(userController.create),
);

router.get(
  '/by-hardware/:hardware',
  handleResponse(userController.getByHardware),
);
router.get('/info', authMiddleware, handleResponse(userController.info));
router.get('/nickaname/:nickname', handleResponse(userController.validateName));
router.get(
  '/latest/tokens',
  authMiddleware,
  handleResponse(userController.tokensUSDAmount),
);
router.get(
  '/latest/transactions',
  authMiddleware,
  handleResponse(userController.meTransactions),
);
router.get(
  '/latest/info',
  authMiddleware,
  handleResponse(userController.latestInfo),
);
router.get(
  '/predicates',
  authMiddleware,
  handleResponse(userController.predicates),
);
router.get('/', authMiddleware, handleResponse(userController.find));
router.get(
  '/:id',
  FindUserByIDParams,
  authMiddleware,
  handleResponse(userController.findOne),
);
router.put(
  '/:id',
  authMiddleware,
  PayloadUpdateUserSchema,
  handleResponse(userController.update),
);

export default router;
