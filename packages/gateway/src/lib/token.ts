import crypto from 'node:crypto';

/**
 * TODO: Create a package `packages/lib` and move this file to it.
 * */

const { API_TOKEN_SECRET, API_TOKEN_SECRET_IV: API_TOKEN_IV } = process.env;

export const API_TOKEN_SECRET_KEY = crypto
  .createHash('sha512')
  .update(API_TOKEN_SECRET)
  .digest('hex')
  .substring(0, 32);

export const API_TOKEN_SECRET_IV = crypto
  .createHash('sha512')
  .update(API_TOKEN_IV)
  .digest('hex')
  .substring(0, 16);

export interface ICLIToken {
  apiToken: string;
  userId: string;
}

export interface ITokenCoder<D> {
  encode(...data: string[]): string;
  decode(data: string): D;
}

export class CLITokenCoder implements ITokenCoder<ICLIToken> {
  constructor(private algorithm: string) {}

  encode(apiToken: string, userId: string) {
    const userToken = `${apiToken}.${userId}`;
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(API_TOKEN_SECRET_KEY),
      Buffer.from(API_TOKEN_SECRET_IV),
    );
    let encrypted = cipher.update(userToken, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decode(token: string) {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(API_TOKEN_SECRET_KEY),
        Buffer.from(API_TOKEN_SECRET_IV),
      );
      let decrypted = decipher.update(token, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      const [apiToken, userId] = decrypted.split('.');
      return { apiToken, userId };
    } catch (_e) {
      throw new Error('Invalid token');
    }
  }
}
