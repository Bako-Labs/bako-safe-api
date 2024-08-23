import {
  ContainerTypes,
  type ValidatedRequestSchema,
} from 'express-joi-validation';

import type AddressBook from '@src/models/AddressBook';
import type { Workspace } from '@src/models/Workspace';

import type { User } from '@models/index';

import type { AuthValidatedRequest } from '@middlewares/auth/types';

import type { IDefaultOrdination, IOrdination } from '@utils/ordination';
import type { IPagination, PaginationParams } from '@utils/pagination';

export enum OrderBy {
  nickname = 'nickname',
}

export enum Sort {
  asc = 'ASC',
  desc = 'DESC',
}

export interface ICreateAddressBookPayload {
  nickname: string;
  address: string;
  user: User;
  owner: Workspace;
}

export type IUpdateAddressBookPayload = Omit<
  ICreateAddressBookPayload,
  'owner' | 'address'
>;

export type IUpdateAddressBookBody = Omit<ICreateAddressBookPayload, 'owner'>;

export interface IFilterAddressBookParams {
  q?: string;
  owner?: string[];
  contactAddress?: string;
  nickname?: string;
  userIds?: string[];
  contactAddresses?: string[];
}

interface ICreateAddressBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ICreateAddressBookPayload;
}

interface IUpdateAddressBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IUpdateAddressBookBody;
  [ContainerTypes.Params]: { id: string };
}

interface IDeleteAddressBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: { id: string };
}

interface IListAddressBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    q: string;
    owner: string[];
    orderBy: OrderBy | IDefaultOrdination;
    sort: Sort;
    page: string;
    perPage: string;
    includePersonal: string;
  };
}

export type ICreateAddressBookRequest =
  AuthValidatedRequest<ICreateAddressBookRequestSchema>;
export type IUpdateAddressBookRequest =
  AuthValidatedRequest<IUpdateAddressBookRequestSchema>;
export type IDeleteAddressBookRequest =
  AuthValidatedRequest<IDeleteAddressBookRequestSchema>;
export type IListAddressBookRequest =
  AuthValidatedRequest<IListAddressBookRequestSchema>;

export interface IAddressBookService {
  ordination(ordination?: IOrdination<AddressBook>): this;
  paginate(pagination?: PaginationParams): this;
  filter(filter: IFilterAddressBookParams): this;

  create: (payload: ICreateAddressBookPayload) => Promise<AddressBook>;
  update: (
    id: string,
    payload: IUpdateAddressBookPayload,
  ) => Promise<AddressBook>;
  delete: (id: string) => Promise<boolean>;
  list: () => Promise<IPagination<AddressBook> | AddressBook[]>;
}
