import { userInfo } from 'node:os';

import { Notification } from '@src/models';

import { ErrorTypes } from '@utils/error/GeneralError';
import Internal from '@utils/error/Internal';
import { type IOrdination, setOrdination } from '@utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@utils/pagination';

import { VaultTemplate } from '@src/models/VaultTemplate';
import type { DeepPartial } from 'typeorm';
import type {
  ICreateNotificationPayload,
  IFilterNotificationParams,
  INotificationService,
  IUpdateNotificationPayload,
} from './types';

export class NotificationService implements INotificationService {
  private _pagination: PaginationParams;
  private _filter: IFilterNotificationParams;
  private _ordination: IOrdination<Notification> = {
    orderBy: 'updatedAt',
    sort: 'DESC',
  };

  filter(filter: IFilterNotificationParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<Notification>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async create(payload: ICreateNotificationPayload): Promise<Notification> {
    const partialPayload: DeepPartial<Notification> = payload;
    return await Notification.create(partialPayload)
      .save()
      .then(() => this.findLast())
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on notification creation',
          detail: e,
        });
      });
  }

  async list(): Promise<IPagination<Notification> | Notification[]> {
    const hasPagination = this._pagination?.page && this._pagination?.perPage;
    const queryBuilder =
      Notification.createQueryBuilder('notification').select();

    this._filter.userId &&
      queryBuilder.andWhere('notification.user_id = :userId', {
        userId: `${this._filter.userId}`,
      });

    this._filter.unread &&
      queryBuilder.andWhere('notification.read = :read', {
        read: false,
      });

    queryBuilder.orderBy(
      `notification.${this._ordination.orderBy}`,
      this._ordination.sort,
    );

    return hasPagination
      ? Pagination.create(queryBuilder)
          .paginate(this._pagination)
          .then((result) => result)
          .catch((e) => Internal.handler(e, 'Error on notification list'))
      : queryBuilder
          .getMany()
          .then((notifications) => notifications)
          .catch((e) => Internal.handler(e, 'Error on notification list'));
  }

  async update(
    userId: string,
    payload: IUpdateNotificationPayload,
  ): Promise<boolean> {
    return Notification.update({ user_id: userId }, payload)
      .then(() => true)
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on notification update',
          detail: e,
        });
      });
  }

  async findLast(): Promise<Notification> {
    return await Notification.createQueryBuilder('notification')
      .select()
      .orderBy('notification.createdAt', 'DESC')
      .getOne()
      .then((data) => data)
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on notification find last',
          detail: e,
        });
      });
  }
}
