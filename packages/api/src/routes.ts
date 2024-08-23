import { Router } from 'express';

import users from '@src/modules/user/routes';

import addressBook from '@modules/addressBook/routes';
import apiToken from '@modules/apiToken/routes';
import auth from '@modules/auth/routes';
import dApp from '@modules/dApps/routes';
import notifications from '@modules/notification/routes';
import predicates from '@modules/predicate/routes';
import predicateVersions from '@modules/predicateVersion/routes';
import transactions from '@modules/transaction/routes';
import vaultTemplate from '@modules/vaultTemplate/routes';
import workspace from '@modules/workspace/routes';

const router = Router();

router.use('/auth', auth);
router.use('/user', users);
router.use('/predicate/version', predicateVersions);
router.use('/predicate', predicates);
router.use('/transaction', transactions);
router.use('/template', vaultTemplate);
router.use('/address-book', addressBook);
router.use('/connections', dApp);
router.use('/notifications', notifications);
router.use('/workspace', workspace);
router.use('/api-token', apiToken);

// ping route
router.get('/ping', ({ res }) =>
  res.send(`${new Date().toISOString()} ${process.env.API_NAME}`),
);

// healthcheck route
router.get('/healthcheck', ({ res }) => res.status(200).send({ status: 'ok' }));

export { router };
