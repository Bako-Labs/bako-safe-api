import axios from 'axios';
import { Brackets } from 'typeorm';

import { User } from '@src/models';
import {
  PermissionRoles,
  type Workspace,
  defaultPermissions,
} from '@src/models/Workspace';
import { ErrorTypes, NotFound } from '@src/utils/error';
import GeneralError from '@src/utils/error/GeneralError';
import Internal from '@src/utils/error/Internal';
import { type IOrdination, setOrdination } from '@src/utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@src/utils/pagination';

import { IconUtils } from '@utils/icons';

import app from '@src/server/app';
import { WorkspaceService } from '../workspace/services';
import type { IFilterParams, IUserPayload, IUserService } from './types';

const { UI_URL } = process.env;

export class UserService implements IUserService {
  private _pagination: PaginationParams;
  private _filter: IFilterParams;
  private _ordination: IOrdination<User>;

  filter(filter: IFilterParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination: IOrdination<User>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async find(): Promise<IPagination<User> | User[]> {
    try {
      const hasPagination = this._pagination?.page && this._pagination?.perPage;
      const hasOrdination = this._ordination?.orderBy && this._ordination?.sort;
      const qb = User.createQueryBuilder('u').select();

      qb.andWhere(
        new Brackets((subQuery) => {
          this._filter.user &&
            subQuery
              .where('LOWER(u.name) LIKE LOWER(:name)', {
                name: `%${this._filter.user}%`,
              })
              .orWhere('LOWER(u.email) LIKE LOWER(:email)', {
                email: `%${this._filter.user}%`,
              });
        }),
      );

      this._filter.address &&
        qb.andWhere('u.address = :address', {
          address: this._filter.address,
        });

      this._filter.active &&
        qb.andWhere('u.active = :active', { active: this._filter.active });

      this._filter.nickname &&
        qb.andWhere('u.name = :nickname', {
          nickname: `%${this._filter.nickname}%`,
        });

      hasOrdination &&
        qb.orderBy(`u.${this._ordination.orderBy}`, this._ordination.sort);

      return hasPagination
        ? await Pagination.create(qb).paginate(this._pagination)
        : await qb.getMany();
    } catch (error) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on user find',
        detail: error,
      });
    }
  }

  async create(payload: IUserPayload): Promise<User> {
    return await User.create(payload)
      .save()
      .then(async (data) => {
        await new WorkspaceService().create({
          name: `singleWorkspace[${data.id}]`,
          owner: data,
          members: [data],
          avatar: IconUtils.user(),
          permissions: {
            [data.id]: defaultPermissions[PermissionRoles.OWNER],
          },
          single: true,
        });
        return data;
      })
      .catch((error) => {
        if (error instanceof GeneralError) throw error;

        throw new Internal({
          type: ErrorTypes.Create,
          title: 'Error on user create',
          detail: error,
        });
      });
  }

  async findOne(id: string): Promise<User> {
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFound({
        type: ErrorTypes.NotFound,
        title: 'User not found',
        detail: `User with id ${id} not found`,
      });
    }

    return user;
  }

  async findByAddress(address: string): Promise<User | undefined> {
    return await User.findOne({ where: { address } })
      .then((user) => user)
      .catch(() => {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'User not found',
          detail: `User with address ${address} was not found`,
        });
      });
  }

  async update(id: string, payload: IUserPayload) {
    return this.findOne(id)
      .then(async (data) => {
        const user = Object.assign(data, payload);
        return await user.save();
      })
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Update,
          title: `User with id ${id} not updated`,
          detail: e,
        });
      });
  }

  async delete(id: string) {
    return await User.update({ id }, { deletedAt: new Date() })
      .then(() => true)
      .catch(() => {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'User not found',
          detail: `User with id ${id} not found`,
        });
      });
  }

  async randomAvatar() {
    const url = UI_URL || 'https://safe.bako.global';
    const avatars_json = await axios
      .get(`${url}/icons/icons.json`)
      .then(({ data }) => data);
    const avatars = avatars_json.values;
    const random = Math.floor(Math.random() * avatars.length);
    return `${url}/${avatars[random]}`;
  }

  async tokensUSDAmount() {
    const tokensQuote = app._quoteCache.getActiveQuotesValues();
    return tokensQuote;
  }

  async workspacesByUser(workspace: Workspace, user: User) {
    const workspaceList = [workspace.id];
    const singleWorkspace = await new WorkspaceService()
      .filter({
        user: user.id,
        single: true,
      })
      .list()
      .then((response: Workspace[]) => response[0]);
    const hasSingle = singleWorkspace.id === workspace.id;

    if (hasSingle) {
      await new WorkspaceService()
        .filter({
          user: user.id,
          single: false,
        })
        .list()
        .then((response: Workspace[]) =>
          response.map((w) => workspaceList.push(w.id)),
        );
    }

    return {
      workspaceList,
      hasSingle,
    };
  }
}
