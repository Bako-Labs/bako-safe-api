import { Address } from 'fuels';
import { In } from 'typeorm';

import { PredicateVersion, User } from '@src/models';
import type { Predicate } from '@src/models/Predicate';

import { predicateVersionMock } from '../predicateVersion';
import { generateInitialUsers } from './initialUsers';

import { BakoSafe } from 'bakosafe';

export const generateInitialPredicate = async (): Promise<
  Partial<Predicate>
> => {
  const users = (await generateInitialUsers()).map((u) => u.name);

  const owner = await User.findOne({
    where: { name: users[0] },
  });
  const predicatePayload = {
    configurable: JSON.stringify({
      SIGNATURES_COUNT: 1,
      SIGNERS: [owner?.address],
    }),
    provider: BakoSafe.getProviders('CHAIN_URL'),
    chainId: 0,
  };
  const members = await User.find({
    take: 3,
    where: {
      name: In(users),
    },
  });
  const version = await PredicateVersion.findOne({
    where: {
      code: predicateVersionMock.code,
    },
  });

  const predicate1: Partial<Predicate> = {
    name: `fake_name: ${members[0].name}`,
    predicateAddress: Address.fromRandom().toB256(),
    description: `fake_description: ${new Date().getTime()}`,
    minSigners: 1,
    configurable: predicatePayload.configurable,
    provider: predicatePayload.provider,
    chainId: predicatePayload.chainId,
    owner,
    members,
    version,
    createdAt: new Date(),
  };

  return predicate1;
};
