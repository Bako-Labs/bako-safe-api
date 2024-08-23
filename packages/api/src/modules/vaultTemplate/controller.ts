import { TypeUser, type User } from '@src/models';

import {
  ErrorTypes,
  Unauthorized,
  UnauthorizedErrorTitles,
  error,
} from '@utils/error';
import { Responses, bindMethods, successful } from '@utils/index';

import { IconUtils } from '@utils/icons';
import type { IUserService } from '../user/types';
import type {
  ICreateVaultTemplateRequest,
  IFindByIdRequest,
  ILisVaultTemplatetRequest,
  IUpdateVaultTemplateRequest,
  IVaultTemplateService,
} from './types';

export class VaultTemplateController {
  private vaultTemplateService: IVaultTemplateService;
  private userService: IUserService;

  constructor(
    vaultTemplateService: IVaultTemplateService,
    userService: IUserService,
  ) {
    Object.assign(this, { vaultTemplateService, userService });
    bindMethods(this);
  }

  async create({ body, user }: ICreateVaultTemplateRequest) {
    try {
      const members: User[] = [];
      for await (const address of body.addresses) {
        let user = await this.userService.findByAddress(address);

        if (!user) {
          user = await this.userService.create({
            address,
            provider: user.provider,
            avatar: IconUtils.user(),
            type: TypeUser.FUEL,
          });
        }

        members.push(user);
      }

      const newTemplate = await this.vaultTemplateService.create({
        ...body,
        createdBy: user,
        addresses: members,
      });
      return successful(newTemplate, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async list(req: ILisVaultTemplatetRequest) {
    const { orderBy, sort, page, perPage, q } = req.query;
    const { user } = req;
    try {
      const response = await this.vaultTemplateService
        .filter({
          user,
          q,
        })
        .ordination({ orderBy, sort })
        .paginate({ page, perPage })
        .list();

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async findById(req: IFindByIdRequest) {
    const { id } = req.params;
    try {
      const response = await this.vaultTemplateService.findById(id);

      return successful(
        {
          ...response,
          addresses: response.addresses.map((address) => address.address),
        },
        Responses.Ok,
      );
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async update(req: IUpdateVaultTemplateRequest) {
    try {
      const { id } = req.params;
      const { body, user } = req;

      const vaultTemplate = await this.vaultTemplateService.findById(id);
      if (vaultTemplate.createdBy.id !== user.id) {
        throw new Unauthorized({
          type: ErrorTypes.Unauthorized,
          title: UnauthorizedErrorTitles.INVALID_PERMISSION,
          detail: 'User not allowed to change vault template',
        });
      }

      const response = await this.vaultTemplateService.update(id, body);
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
