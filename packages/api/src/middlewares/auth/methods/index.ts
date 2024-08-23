import {
  type AuthStrategy,
  CliAuthStrategy,
  CodeAuthStrategy,
  TokenAuthStrategy,
} from './strategies';

export class AuthStrategyFactory {
  static createStrategy(signature: string): AuthStrategy {
    if (signature.startsWith('cli')) {
      return new CliAuthStrategy();
    }

    if (signature.startsWith('code')) {
      return new CodeAuthStrategy();
    }

    return new TokenAuthStrategy();
  }
}
