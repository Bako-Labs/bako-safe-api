import { User } from '@src/models';
import type { VaultTemplate } from '@src/models/VaultTemplate';

import { accounts } from '../accounts';

export const generateInitialTemplate = async (): Promise<
  Partial<VaultTemplate>
> => {
  const owner = await User.findOne({
    where: { address: accounts.USER_1.address },
  });

  const members = await User.find({
    take: 3,
    order: {
      createdAt: 'ASC',
    },
  });

  const t1: Partial<VaultTemplate> = {
    name: 'fake_name_template',
    description: 'fake_description',
    minSigners: 2,
    createdBy: owner,
    addresses: members,
  };

  return t1;
};
