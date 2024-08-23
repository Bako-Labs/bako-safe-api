import type { SelectQueryBuilder } from 'typeorm';

import type { IPagination, PaginationParams } from './types';

export class Pagination<T> {
  constructor(private _queryBuilder: SelectQueryBuilder<T>) {}

  static create<T>(queryBuilder: SelectQueryBuilder<T>) {
    return new Pagination(queryBuilder);
  }

  async paginate(params: PaginationParams): Promise<IPagination<T>> {
    const currentPage = Number(params.page || 0);
    const perPage = Number(params.perPage || 10);

    const take = perPage;
    const skip = currentPage * perPage;

    const data = await this._queryBuilder.take(take).skip(skip).getMany();
    const total = await this._queryBuilder.getCount();
    const totalPages = total === 0 ? 0 : Math.ceil(total / perPage);

    return {
      nextPage: currentPage + 1,
      prevPage: currentPage === 0 ? 0 : currentPage - 1,
      currentPage,
      totalPages,
      perPage,
      total,
      data,
    };
  }
}
