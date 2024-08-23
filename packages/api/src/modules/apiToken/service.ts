import crypto from 'node:crypto';
import { API_TOKEN_SECRET_IV, API_TOKEN_SECRET_KEY } from '@config/secrets';
import type {
  IAPITokenService,
  ICLIToken,
  IDeleteAPITokenPayload,
  IListAPITokenPayload,
  ITokenCoder,
} from '@modules/apiToken/types';
import { APIToken } from '@src/models';
import { ErrorTypes } from '@utils/error';
import Internal from '@utils/error/Internal';

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

export class APITokenService implements IAPITokenService {
  // TODO: Change to receive in constructor
  private tokenCoder = new CLITokenCoder('aes-256-cbc');

  async create(payload: Partial<APIToken>) {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      const apiToken = APIToken.create({
        token,
        name: payload.name,
        config: payload.config,
        predicate: payload.predicate,
      });
      return apiToken.save();
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on create API Token',
        detail: e,
      });
    }
  }

  async list(params: IListAPITokenPayload) {
    try {
      return APIToken.find({
        where: {
          predicate: { id: params.predicateId },
          deletedAt: null,
        },
      });
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on list API Token',
        detail: e,
      });
    }
  }

  async delete(payload: IDeleteAPITokenPayload) {
    try {
      await APIToken.update(
        {
          id: payload.id,
          predicate: { id: payload.predicateId },
        },
        { deletedAt: new Date() },
      );
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on delete API Token',
        detail: e,
      });
    }
  }

  generateCLIToken(apiToken: string, userId: string) {
    return this.tokenCoder.encode(apiToken, userId);
  }

  decodeCLIToken(token: string): ICLIToken {
    return this.tokenCoder.decode(token);
  }
}
