import type { Request } from 'express';
import type {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import type { ParsedQs } from 'qs';

import type { Workspace } from '@src/models/Workspace';

import type UserToken from '@models/UserToken';
import type { User } from '@models/index';

export interface AuthValidatedRequest<T extends ValidatedRequestSchema>
  extends Request {
  body: T[ContainerTypes.Body];
  query: T[ContainerTypes.Query] & ParsedQs;
  headers: T[ContainerTypes.Headers];
  params: T[ContainerTypes.Params];
  accessToken?: string;
  user?: User;
  userToken?: UserToken;
  workspace?: Workspace;
}

export interface UnloggedRequest<T extends ValidatedRequestSchema>
  extends Request {
  body: T[ContainerTypes.Body];
  query: T[ContainerTypes.Query] & ParsedQs;
  headers: T[ContainerTypes.Headers];
}

export type IAuthRequest = AuthValidatedRequest<ValidatedRequestSchema>;
export type IChangeWorkspaceRequest =
  AuthValidatedRequest<ValidatedRequestSchema>;
