import { Responses, bindMethods, successful } from '@src/utils';
import { error } from '@src/utils/error';
import type {
  IFindByCodeRequest,
  IListRequest,
  IPredicateVersionService,
} from './types';

export class PredicateVersionController {
  private predicateVersionService: IPredicateVersionService;

  constructor(predicateVersionService: IPredicateVersionService) {
    this.predicateVersionService = predicateVersionService;
    bindMethods(this);
  }

  async list(req: IListRequest) {
    const { orderBy, sort, page, perPage, code, active, q } = req.query;

    try {
      const response = await this.predicateVersionService
        .filter({ code, active, q })
        .ordination({ orderBy, sort })
        .paginate({ page, perPage })
        .list();

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async findByCode(req: IFindByCodeRequest) {
    const { code } = req.params;

    try {
      const response = await this.predicateVersionService.findByCode(code);

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async findCurrentVersion() {
    try {
      const response = await this.predicateVersionService.findCurrentVersion();
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
