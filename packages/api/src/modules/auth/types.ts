import {
  ContainerTypes,
  type ValidatedRequestSchema,
} from 'express-joi-validation';

import type { IPermissions, Workspace } from '@src/models/Workspace';

import type UserToken from '@models/UserToken';
import type { Encoder } from '@models/UserToken';
import type { User } from '@models/index';

import type {
  AuthValidatedRequest,
  UnloggedRequest,
} from '@middlewares/auth/types';

export interface ICreateUserTokenPayload {
  token: string;
  user: User;
  expired_at: Date;
  encoder: Encoder;
  provider: string;
  payload: string;
  workspace: Workspace;
}

export interface ISignInPayload {
  encoder: Encoder;
  signature: string;
  digest: string;
}

interface IActiveSessionRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string;
    address: string;
  };
}

interface IListRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    user: string;
    active: boolean;
    page: string;
    perPage: string;
    sort: 'ASC' | 'DESC';
    orderBy: 'name' | 'createdAt' | 'role';
  };
}

interface ISignInRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: ISignInPayload;
}

interface IFindDappRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionID: string;
  };
}

interface IAuthorizeDappRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    sessionId: string;
    url: string;
    name: string;
    address: string;
  };
}

export interface IFindTokenParams {
  userId?: string;
  address?: string;
  signature?: string;
  notExpired?: boolean;
}

export interface ISignInResponse {
  accessToken: string;
  expired_at: Date;
  avatar: string;
  user_id: string;
  workspace: {
    id: string;
    name: string;
    avatar: string;
    permissions: IPermissions;
    single: boolean;
  };
}

export interface IUpgradeWorkspace extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    workspace: string;
    user: string;
  };
}

export interface ICreateRecoverCodeRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    address: string;
  };
}

export type IListRequest = AuthValidatedRequest<IListRequestSchema>;
export type ISignInRequest = UnloggedRequest<ISignInRequestSchema>;
export type IGoToSingleWorkspaceRequest =
  AuthValidatedRequest<ValidatedRequestSchema>;
export type IFindDappRequest = AuthValidatedRequest<IFindDappRequestSchema>;
export type IActiveSession = AuthValidatedRequest<IActiveSessionRequestSchema>;
export type IChangeWorkspaceRequest = AuthValidatedRequest<IUpgradeWorkspace>;
export type IAuthorizeDappRequest =
  AuthValidatedRequest<IAuthorizeDappRequestSchema>;
export type ICreateRecoverCodeRequest =
  UnloggedRequest<ICreateRecoverCodeRequestSchema>;

export interface IAuthService {
  signIn(payload: ICreateUserTokenPayload): Promise<ISignInResponse>;
  signOut(user: User): Promise<void>;
  findToken(params: IFindTokenParams): Promise<UserToken | undefined>;
}
