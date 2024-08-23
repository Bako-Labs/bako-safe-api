import GeneralError, { type Error } from './GeneralError';

export enum UnauthorizedErrorTitles {
  MISSING_CREDENTIALS = 'Missing credentials',
  INVALID_CREDENTIALS = 'Invalid credentials',
  SESSION_NOT_FOUND = 'Session not found',
  ACCESS_TOKEN_NOT_PROVIDED = 'Access token not provided',
  MISSING_AUTH_PARAMS = 'Missing authentication params',
  INVALID_ADDRESS = 'Invalid address',
  INVALID_ACCESS_TOKEN = 'Invalid access token',
  EXPIRED_TOKEN = 'Expired token',
  INVALID_PERMISSION = 'Invalid permission',
  MISSING_PERMISSION = 'Missing permission',
  INVALID_SIGNATURE = 'Invalid signature',
  INVALID_ENCODER = 'Invalid encoder',
  INVALID_RECOVER_CODE = 'Invalid recover code',
  UNAUTHORIZED_RESOURCE = 'Unauthorized resource',
}

export interface UnauthorizedError extends Omit<Error, 'title'> {
  title: UnauthorizedErrorTitles;
}

// -> retornado quando o usuário nao está autenticado
class Unauthorized extends GeneralError {
  constructor(error: UnauthorizedError) {
    super(error, 401);
  }
}

export { Unauthorized };
