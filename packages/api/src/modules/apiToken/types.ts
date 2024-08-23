import type { AuthValidatedRequest } from '@middlewares/auth/types';
import type { APIToken } from '@src/models';
import {
  ContainerTypes,
  type ValidatedRequestSchema,
} from 'express-joi-validation';

export interface ICreateAPITokenPayload {
  name: string;
  config?: { transactionTitle: string };
}

export interface IDefaultAPITokenParams {
  predicateId: string;
  id: string;
}

export interface ICLIToken {
  apiToken: string;
  userId: string;
}

export type IDeleteAPITokenPayload = IDefaultAPITokenParams;
export type IListAPITokenPayload = Pick<IDefaultAPITokenParams, 'predicateId'>;

interface ICreateAPITokenRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: Pick<IDefaultAPITokenParams, 'predicateId'>;
  [ContainerTypes.Body]: ICreateAPITokenPayload;
}

export type ICreateAPITokenRequest =
  AuthValidatedRequest<ICreateAPITokenRequestSchema>;

export interface ITokenCoder<D> {
  encode(...data: string[]): string;
  decode(data: string): D;
}

export interface IAPITokenService {
  create(payload: Partial<APIToken>): Promise<APIToken>;
  delete(params: IDeleteAPITokenPayload): Promise<void>;
  list(params: IListAPITokenPayload): Promise<APIToken[]>;

  decodeCLIToken(token: string): ICLIToken;
  generateCLIToken(apiToken: string, userId: string): string;
}
