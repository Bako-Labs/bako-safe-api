import crypto from 'node:crypto';

import { type DApp, Predicate, User } from '@src/models';

export const generateInitialDapp = async (): Promise<Partial<DApp>> => {
  const predicate = await Predicate.find({
    order: {
      createdAt: 'ASC',
    },
    take: 1,
  });

  const user = await User.find({
    order: {
      createdAt: 'ASC',
    },
    take: 1,
  });

  const t1: Partial<DApp> = {
    sessionId: crypto.randomUUID(),
    origin: 'https://safe.bako.global',
    name: 'BSAFE - multsig',
    vaults: [predicate[0]],
    currentVault: predicate[0],
    user: user[0],
  };

  return t1;
};
