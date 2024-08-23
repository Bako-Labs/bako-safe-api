import type GeneralError from '@utils/error/GeneralError';

export { default as BadRequest } from './BadRequest';
export * from './GeneralError';
export { default as NotFound } from './NotFound';
export * from './Forbidden';
export * from './Unauthorized';
export { default as Internal } from './Internal';

export enum Responses {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
}

export interface ErrorResponse<T> {
  payload: T;
  statusCode: Responses;
}

const error = <ResponsePayload extends GeneralError>(
  payload: ResponsePayload,
  statusCode: Responses,
): ErrorResponse<ResponsePayload> => {
  if ('detail' in payload && process.env.NODE_ENV !== 'development') {
    payload.detail = null;
  }

  return {
    payload,
    statusCode,
  };
};

export { error };
