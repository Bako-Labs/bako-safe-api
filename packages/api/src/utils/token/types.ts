import type { Encoder } from '@src/models/UserToken';

export type IVeryfySignature = {
  signature: string;
  digest: string;
  encoder: Encoder;
};
