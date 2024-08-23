import type AddressBook from '@src/models/AddressBook';
import type { Workspace } from '@src/models/Workspace';
import Internal from '@src/utils/error/Internal';
import type { IPagination } from '@src/utils/pagination';

import { ErrorTypes, error } from '@utils/error';
import { Responses, bindMethods, successful } from '@utils/index';

import { TypeUser } from '@src/models';
import { IconUtils } from '@utils/icons';
import type { IUserService } from '../user/types';
import { WorkspaceService } from '../workspace/services';
import { AddressBookService } from './services';
import type {
  IAddressBookService,
  ICreateAddressBookRequest,
  IDeleteAddressBookRequest,
  IListAddressBookRequest,
  IUpdateAddressBookRequest,
} from './types';

const { FUEL_PROVIDER } = process.env;

export class AddressBookController {
  private addressBookService: IAddressBookService;
  private userService: IUserService;

  constructor(
    addressBookService: IAddressBookService,
    userService: IUserService,
  ) {
    Object.assign(this, { addressBookService, userService });
    bindMethods(this);
  }

  async create(req: ICreateAddressBookRequest) {
    try {
      const { address, nickname } = req.body;
      const { workspace, user } = req;
      const duplicatedNickname = await new AddressBookService()
        .filter({
          owner: [workspace.id],
          nickname,
        })
        .list()
        .then((response: AddressBook[]) => response.length > 0);

      const duplicatedAddress = await new AddressBookService()
        .filter({
          owner: [workspace.id],
          contactAddress: address,
        })
        .paginate(undefined)
        .list()
        .then((response: AddressBook[]) => response.length > 0);

      const hasDuplicate = duplicatedNickname || duplicatedAddress;

      if (hasDuplicate) {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on contact creation',
          detail: `Duplicated ${duplicatedNickname ? 'nickname' : 'address'}`,
        });
      }

      let savedUser = await this.userService.findByAddress(address);

      if (!savedUser) {
        savedUser = await this.userService.create({
          address,
          provider: user.provider,
          avatar: IconUtils.user(),
          type: TypeUser.FUEL,
          active: true,
        });
      }

      const newContact = await this.addressBookService.create({
        ...req.body,
        user: savedUser,
        owner: workspace,
      });

      return successful(newContact, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async update({ body, params, user }: IUpdateAddressBookRequest) {
    try {
      const duplicatedNickname = await this.addressBookService
        .filter({
          owner: [user.id],
          nickname: body.nickname,
        })
        .list();

      const duplicatedAddress = await this.addressBookService
        .filter({
          owner: [user.id],
          contactAddress: body.address,
        })
        .list();

      const hasDuplicate =
        ((duplicatedNickname as AddressBook[]).length &&
          duplicatedNickname[0].id !== params.id) ||
        ((duplicatedAddress as AddressBook[]).length &&
          duplicatedAddress[0].id !== params.id);

      if (hasDuplicate) {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on contact update',
          detail: 'Unavailable address or nickname',
        });
      }

      let savedUser = await this.userService.findByAddress(body.address);

      if (!savedUser) {
        savedUser = await this.userService.create({
          address: body.address,
          provider: user.provider,
          avatar: IconUtils.user(),
          type: TypeUser.FUEL,

          active: true,
        });
      }

      const { address, ...rest } = body;

      const updatedContact = await this.addressBookService.update(params.id, {
        ...rest,
        user: savedUser,
      });
      return successful(updatedContact, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async delete({ params }: IDeleteAddressBookRequest) {
    try {
      const deletedContact = await this.addressBookService.delete(params.id);
      return successful(deletedContact, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async list(req: IListAddressBookRequest) {
    const { workspace, user } = req;
    const { orderBy, sort, page, perPage, q, includePersonal } = req.query;

    try {
      const owner = [workspace.id];
      const singleWk = await new WorkspaceService()
        .filter({
          user: user.id,
          single: true,
        })
        .list()
        .then((response: Workspace[]) => response[0].id);
      const hasIncludePersonal = includePersonal === 'true';
      if (hasIncludePersonal) {
        owner.push(singleWk);
      }

      const response = await this.addressBookService
        .filter({ owner, q })
        .ordination({ orderBy, sort })
        .paginate({ page, perPage })
        .list()
        .then((response: AddressBook[] | IPagination<AddressBook>) => {
          if (Array.isArray(response)) {
            return AddressBookService.formattDuplicatedAddress(
              response,
              singleWk,
              hasIncludePersonal,
              workspace.id,
            );
          }

          return {
            ...response,
            data: AddressBookService.formattDuplicatedAddress(
              response.data,
              singleWk,
              hasIncludePersonal,
              workspace.id,
            ),
          };
        });

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
