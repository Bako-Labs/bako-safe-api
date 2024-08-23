import type {
  IAPITokenService,
  ICreateAPITokenRequest,
} from '@modules/apiToken/types';
import type { IPredicateService } from '@modules/predicate/types';
import { Responses, bindMethods, successful } from '@src/utils';
import { ErrorTypes, NotFound, error } from '@utils/error';
import type { Request } from 'express';

export class APITokenController {
  constructor(
    private apiTokenService: IAPITokenService,
    private predicateService: IPredicateService,
  ) {
    bindMethods(this);
  }

  async create(req: ICreateAPITokenRequest) {
    const { user, body, params } = req;

    const { name, config } = body;
    const { predicateId } = params;

    try {
      const predicate = await this.predicateService.findById(predicateId);

      if (!predicate) {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Predicate not found',
          detail: `Predicate with id ${predicateId} not found`,
        });
      }

      const apiToken = await this.apiTokenService.create({
        name,
        config,
        predicate,
      });
      const cliToken = this.apiTokenService.generateCLIToken(
        apiToken.token,
        user.id,
      );

      return successful(
        {
          id: apiToken.id,
          name: apiToken.name,
          token: cliToken,
          config: apiToken.config,
        },
        Responses.Ok,
      );
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async list(req: Request) {
    const { params } = req;
    const { predicateId } = params;

    try {
      const tokens = await this.apiTokenService.list({ predicateId });
      return successful(tokens, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async delete(req: Request) {
    const { params } = req;
    const { predicateId, id } = params;

    try {
      await this.apiTokenService.delete({ id, predicateId });
      return successful(null, Responses.Created);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
