import { User } from '@src/models';
import type AddressBook from '@src/models/AddressBook';
import { Workspace } from '@src/models/Workspace';

import { accounts } from '../accounts';

export const generateInitialAddressBook = async (): Promise<
  Partial<AddressBook>[]
> => {
  const owner = await Workspace.findOne({
    order: {
      createdAt: 'DESC',
    },
  });

  const a1: Partial<AddressBook> = {
    nickname: 'Store',
    owner,
    user: await User.findOne({
      where: { address: accounts.STORE.address },
    }),
  };

  const a2: Partial<AddressBook> = {
    nickname: 'User 2',
    owner,
    user: await User.findOne({
      where: { address: accounts.USER_2.address },
    }),
  };

  return [a1, a2];
};
