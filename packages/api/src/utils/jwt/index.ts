import JWT from 'jsonwebtoken';

import type { IAuthRequest } from '@src/middlewares/auth/types';

import type { IAccessTokenPayload, IRefreshTokenPayload } from './types';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRES = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES = '5d'; // 5 days

export class JwtUtils {
  static getTokenFromHeader(req: IAuthRequest) {
    const authorization = req.headers.authorization;
    const tokenString = authorization?.split(' ')[1];
    return tokenString;
  }

  static generateAccessToken(payload: IAccessTokenPayload) {
    const accessToken = JWT.sign(payload as never, ACCESS_TOKEN_SECRET, {
      algorithm: ALGORITHM,
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    return accessToken;
  }

  static generateRefreshToken(payload: IRefreshTokenPayload) {
    const refreshToken = JWT.sign(payload as never, REFRESH_TOKEN_SECRET, {
      algorithm: ALGORITHM,
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });

    return refreshToken;
  }

  static verifyAccessToken(token: string) {
    const accessTokenVerified = JWT.verify(token, ACCESS_TOKEN_SECRET);
    return accessTokenVerified;
  }

  static verifyRefreshToken(token: string) {
    const refreshTokenVerified = JWT.verify(token, REFRESH_TOKEN_SECRET);
    return refreshTokenVerified;
  }

  static decodeToken(token: string) {
    const decodedToken = JWT.decode(token);
    return decodedToken;
  }
}
