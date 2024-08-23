import { VaultTemplate } from '@src/models/VaultTemplate';

import { NotFound } from '@utils/error';
import GeneralError, { ErrorTypes } from '@utils/error/GeneralError';
import Internal from '@utils/error/Internal';
import { type IOrdination, setOrdination } from '@utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@utils/pagination';

import type { DeepPartial } from 'typeorm';
import type {
  ICreatePayload,
  IFilterParams,
  IUpdatePayload,
  IVaultTemplateService,
} from './types';

export class VaultTemplateService implements IVaultTemplateService {
  private _ordination: IOrdination<VaultTemplate> = {
    orderBy: 'updatedAt',
    sort: 'DESC',
  };
  private _pagination: PaginationParams;
  private _filter: IFilterParams;
  filter(filter: IFilterParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<VaultTemplate>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async create(payload: ICreatePayload): Promise<VaultTemplate> {
    const partialPayload: DeepPartial<VaultTemplate> = payload;
    return await VaultTemplate.create(partialPayload)
      .save()
      .then(() => this.findLast())
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on vault template creation',
          detail: e,
        });
      });
  }

  async update(id: string, payload?: IUpdatePayload): Promise<VaultTemplate> {
    return await VaultTemplate.update({ id }, payload)
      .then(() => this.findById(id))
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction update',
          detail: e,
        });
      });
  }

  async findById(id: string): Promise<VaultTemplate> {
    return await VaultTemplate.findOne({
      where: { id },
      relations: ['addresses'],
    })
      .then((template) => {
        if (!template) {
          throw new NotFound({
            type: ErrorTypes.NotFound,
            title: 'Vault not found',
            detail: `No vault template was found for the provided ID: ${id}.`,
          });
        }

        return template;
      })
      .catch((e) => {
        if (e instanceof GeneralError) throw e;

        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction findById',
          detail: e,
        });
      });
  }

  async list(): Promise<IPagination<VaultTemplate> | VaultTemplate[]> {
    const hasPagination = this._pagination?.page && this._pagination?.perPage;
    const queryBuilder = VaultTemplate.createQueryBuilder('t').select();

    this._filter.q &&
      queryBuilder.where('LOWER(t.name) LIKE LOWER(:name)', {
        name: `%${this._filter.q}%`,
      });

    this._filter.user &&
      queryBuilder.andWhere('t.created_by = :createdBy', {
        createdBy: this._filter.user.id,
      });

    queryBuilder.orderBy(
      `t.${this._ordination.orderBy}`,
      this._ordination.sort,
    );

    const handleInternalError = (e) => {
      if (e instanceof GeneralError) throw e;
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on vault template list',
        detail: e,
      });
    };

    return hasPagination
      ? Pagination.create(queryBuilder)
          .paginate(this._pagination)
          .then((paginationResult) => paginationResult)
          .catch(handleInternalError)
      : queryBuilder
          .getMany()
          .then((template) => {
            return template ?? [];
          })
          .catch(handleInternalError);
  }

  async findLast(): Promise<VaultTemplate> {
    try {
      return await VaultTemplate.createQueryBuilder('t')
        .select()
        .take(1)
        .orderBy('t.createdAt', 'DESC')
        .getOne();
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on vault template find last',
        detail: e,
      });
    }
  }
}
