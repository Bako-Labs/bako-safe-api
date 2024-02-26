import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { AuthValidatedRequest, UnloggedRequest } from '@src/middlewares/auth/types';
import { TypeUser, User } from '@src/models';
import { IDefaultOrdination, IOrdination } from '@src/utils/ordination';
import { IPagination, PaginationParams } from '@src/utils/pagination';

export interface IWebAuthnSignUp {
  id: string;
  publicKey: string;
  origin: string;
}

export interface IUserPayload {
  name: string;
  type: TypeUser;
  address: string;
  provider: string;

  avatar?: string;
  webauthn?: IWebAuthnSignUp;
}

export interface IFilterParams {
  user?: string;
  active?: boolean;
  nickname?: string;
  address?: string;
}

interface ICreateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IUserPayload;
}

interface IListRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    user: string;
    active: boolean;
    page: string;
    perPage: string;
    sort: 'ASC' | 'DESC';
    orderBy: 'name' | IDefaultOrdination;
  };
}

interface IFindOneRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

interface ICheckNickname extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    nickname: string;
  };
}

interface IUpdateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
  [ContainerTypes.Body]: IUserPayload;
}

export type ICreateRequest = AuthValidatedRequest<ICreateRequestSchema>;

export type IListRequest = AuthValidatedRequest<IListRequestSchema>;

export type IFindOneRequest = AuthValidatedRequest<IFindOneRequestSchema>;

export type IUpdateRequest = AuthValidatedRequest<IUpdateRequestSchema>;

export type IDeleteRequest = AuthValidatedRequest<IFindOneRequestSchema>;

export type IMeRequest = AuthValidatedRequest<IListRequestSchema>;

export type ICheckNicknameRequest = UnloggedRequest<ICheckNickname>;

export interface IUserService {
  filter(filter: IFilterParams): this;
  paginate(pagination: PaginationParams): this;
  ordination(ordination: IOrdination<User>): this;
  find(): Promise<IPagination<User> | User[]>;
  create(payload: Partial<User>): Promise<User>;
  findOne(id: string): Promise<User>;
  findByAddress(address: string): Promise<User | undefined>;
  randomAvatar(): Promise<string>;
  update(id: string, payload: IUserPayload): Promise<User>;
  delete(id: string): Promise<boolean>;
}
