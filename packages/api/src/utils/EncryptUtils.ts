import { createHash } from 'node:crypto';
import bcrypt from 'bcrypt';

const SALT = 10;
const ALGORITHM = 'sha256';
const DIGEST = 'hex';

class EncryptUtils {
  static async encrypt(value: string) {
    const hash = await bcrypt.hash(value, SALT);
    return hash;
  }

  static async compare(value: string, valueEncrypted: string) {
    const result = await bcrypt.compare(value, valueEncrypted);
    return result;
  }

  static async encryptToken(value: string) {
    const hashSha256 = createHash(ALGORITHM).update(value).digest(DIGEST);
    const hash = await bcrypt.hash(hashSha256, SALT);
    return hash;
  }

  static async compareToken(value: string, valueEncrypted: string) {
    const hash = createHash(ALGORITHM).update(value).digest(DIGEST);
    const result = await bcrypt.compare(hash, valueEncrypted);
    return result;
  }
}

export { EncryptUtils };
