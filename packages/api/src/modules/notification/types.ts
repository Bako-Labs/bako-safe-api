import {
  ContainerTypes,
  type ValidatedRequestSchema,
} from 'express-joi-validation';

import type { AuthValidatedRequest } from '@src/middlewares/auth/types';
import type {
  Notification,
  NotificationSummary,
  NotificationTitle,
} from '@src/models/index';

import type { IDefaultOrdination, IOrdination } from '@utils/ordination';
import type { IPagination, PaginationParams } from '@utils/pagination';

export enum Sort {
  asc = 'ASC',
  desc = 'DESC',
}

export interface ICreateNotificationPayload {
  user_id?: string;
  title: NotificationTitle;
  read?: boolean;
  summary: NotificationSummary;
}

export type IUpdateNotificationPayload = Partial<ICreateNotificationPayload>;

export interface IFilterNotificationParams {
  userId?: string;
  unread?: boolean;
}

interface IListNotificationsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    orderBy: IDefaultOrdination;
    sort: Sort;
    page: string;
    perPage: string;
  };
}

type IReadAllNotificationsRequestSchema = ValidatedRequestSchema;

export type IListNotificationsRequest =
  AuthValidatedRequest<IListNotificationsRequestSchema>;
export type IReadAllNotificationsRequest =
  AuthValidatedRequest<IReadAllNotificationsRequestSchema>;

export interface INotificationService {
  ordination(ordination?: IOrdination<Notification>): this;
  paginate(pagination?: PaginationParams): this;
  filter(filter: IFilterNotificationParams): this;

  list: () => Promise<IPagination<Notification> | Notification[]>;
  create: (payload: ICreateNotificationPayload) => Promise<Notification>;
  update: (
    selector: unknown,
    payload: IUpdateNotificationPayload,
  ) => Promise<boolean>;
}
