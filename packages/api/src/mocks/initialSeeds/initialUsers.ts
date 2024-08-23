import { TypeUser, type User } from '@src/models';

import { IconUtils } from '@utils/icons';

import { accounts } from '../accounts';
import { networks } from '../networks';

export const ADMIN_EMAIL = 'fake_email@gmail.com';

export const generateInitialUsers = async (): Promise<Partial<User>[]> => {
  const user1: Partial<User> = {
    name: `${accounts.STORE.privateKey}`,
    active: true,
    email: ADMIN_EMAIL,
    provider: networks.local,
    address: accounts.STORE.account,
    avatar: IconUtils.user(),
    createdAt: new Date(),
    type: TypeUser.FUEL,
  };

  const user2: Partial<User> = {
    name: `${accounts.USER_1.privateKey}`,
    active: true,
    email: ADMIN_EMAIL,
    provider: networks.local,
    address: accounts.USER_1.account,
    avatar: IconUtils.user(),
    createdAt: new Date(),
    type: TypeUser.FUEL,
  };

  const user3: Partial<User> = {
    name: `${accounts.USER_2.privateKey}`,
    active: true,
    email: ADMIN_EMAIL,
    provider: networks.local,
    address: accounts.USER_2.account,
    avatar: IconUtils.user(),
    createdAt: new Date(),
    type: TypeUser.FUEL,
  };

  const user4: Partial<User> = {
    name: `${accounts.USER_3.privateKey}`,
    active: true,
    email: ADMIN_EMAIL,
    provider: networks.local,
    address: accounts.USER_3.account,
    avatar: IconUtils.user(),
    createdAt: new Date(),
    type: TypeUser.FUEL,
  };

  return [user1, user2, user3, user4];
};
