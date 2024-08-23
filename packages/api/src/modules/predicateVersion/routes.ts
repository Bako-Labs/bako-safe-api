import { handleResponse } from '@src/utils';
import { Router } from 'express';
import { PredicateVersionController } from './controller';
import { PredicateVersionService } from './services';

const router = Router();
const predicateVersionService = new PredicateVersionService();
const { list, findByCode, findCurrentVersion } = new PredicateVersionController(
  predicateVersionService,
);

router.get('/', handleResponse(list));
router.get('/current', handleResponse(findCurrentVersion));
router.get('/:code', handleResponse(findByCode));

export default router;
