import { PredicateVersion } from '@src/models';
import { ErrorTypes, NotFound } from '@src/utils/error';
import GeneralError from '@src/utils/error/GeneralError';
import Internal from '@src/utils/error/Internal';
import { type IOrdination, setOrdination } from '@src/utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@src/utils/pagination';
import { Brackets } from 'typeorm';
import type {
  IPredicateVersionFilterParams,
  IPredicateVersionService,
} from './types';

export class PredicateVersionService implements IPredicateVersionService {
  private _ordination: IOrdination<PredicateVersion> = {
    orderBy: 'updatedAt',
    sort: 'DESC',
  };
  private _pagination: PaginationParams;
  private _filter: IPredicateVersionFilterParams;

  filter(filter: IPredicateVersionFilterParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<PredicateVersion>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async list(): Promise<IPagination<PredicateVersion> | PredicateVersion[]> {
    const hasPagination = this._pagination?.page && this._pagination?.perPage;
    const hasOrdination = this._ordination?.orderBy && this._ordination?.sort;

    const qb = PredicateVersion.createQueryBuilder('pv').select();

    const handleInternalError = (e) => {
      if (e instanceof GeneralError) throw e;

      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on predicate version list',
        detail: e,
      });
    };

    this._filter.active &&
      qb.andWhere('pv.active = :active', { active: this._filter.active });

    this._filter.code &&
      qb.andWhere('pv.code = :code', {
        code: this._filter.code,
      });

    this._filter.q &&
      qb.andWhere(
        new Brackets((qb) =>
          qb
            .where('LOWER(pv.name) LIKE LOWER(:name)', {
              name: `%${this._filter.q}%`,
            })
            .orWhere('LOWER(pv.description) LIKE LOWER(:description)', {
              description: `%${this._filter.q}%`,
            }),
        ),
      );

    hasOrdination &&
      qb.orderBy(`pv.${this._ordination.orderBy}`, this._ordination.sort);

    return hasPagination
      ? Pagination.create(qb)
          .paginate(this._pagination)
          .then((result) => result)
          .catch(handleInternalError)
      : qb
          .getMany()
          .then((predicateVersions) => predicateVersions ?? [])
          .catch(handleInternalError);
  }

  async findByCode(code: string): Promise<PredicateVersion> {
    return await PredicateVersion.findOne({ where: { code } })
      .then((predicateVersion) => {
        if (!predicateVersion) {
          throw new NotFound({
            type: ErrorTypes.NotFound,
            title: 'Predicate version not found',
            detail: `Predicate version with code ${code} was not found`,
          });
        }

        return predicateVersion;
      })
      .catch((e) => {
        if (e instanceof GeneralError) throw e;

        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on predicate version findByCode',
          detail: e,
        });
      });
  }

  async findCurrentVersion(): Promise<PredicateVersion> {
    return await PredicateVersion.findOne({
      where: { active: true },
      order: { updatedAt: 'DESC' },
    })
      .then((predicateVersion) => {
        if (!predicateVersion) {
          throw new NotFound({
            type: ErrorTypes.NotFound,
            title: 'Predicate version not found',
            detail: 'No predicate version was found.',
          });
        }

        return predicateVersion;
      })
      .catch((e) => {
        if (e instanceof GeneralError) throw e;

        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on predicate version findCurrentVersion',
          detail: e,
        });
      });
  }
}
