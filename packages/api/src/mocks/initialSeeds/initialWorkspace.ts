import { randomBytes } from 'node:crypto';

import { User } from '@src/models';
import {
  PermissionRoles,
  Workspace,
  defaultPermissions,
} from '@src/models/Workspace';

import { IconUtils } from '@utils/icons';
import { accounts } from '../accounts';

export const generateInitialWorkspace = async (): Promise<Workspace> => {
  const members = await User.find({
    take: 3,
    order: {
      createdAt: 'ASC',
    },
  });
  return Workspace.create({
    name: randomBytes(10).toString('hex'),
    description: `Description ${randomBytes(10).toString('hex')}`,
    avatar: IconUtils.workspace(),
    members,
    owner: members[0],
    permissions: {
      [members[0].id]: {
        [PermissionRoles.ADMIN]: ['*'],
        [PermissionRoles.OWNER]: ['*'],
        [PermissionRoles.VIEWER]: ['*'],
        [PermissionRoles.SIGNER]: ['*'],
      },
      [members[1].id]: {
        [PermissionRoles.ADMIN]: ['*'],
        [PermissionRoles.VIEWER]: ['*'],
        [PermissionRoles.SIGNER]: ['*'],
      },
      [members[2].id]: {
        [PermissionRoles.VIEWER]: ['*'],
        [PermissionRoles.SIGNER]: ['*'],
      },
    },
    single: false,
  });
};

export const generateInitialAuxWorkspace = async (): Promise<Workspace> => {
  const members = await User.createQueryBuilder('user')
    .where('user.address IN (:...address)', {
      address: [
        accounts.USER_1.address,
        accounts.USER_2.address,
        accounts.USER_3.address,
      ],
    })
    .getMany();

  const acc_1 = members.find((m) => m.address === accounts.USER_1.address);
  const non_acc = members.filter((m) => m.address !== accounts.USER_1.address);

  return Workspace.create({
    name: `[INITIAL]${randomBytes(10).toString('hex')}`,
    description: `Description ${randomBytes(10).toString('hex')}`,
    avatar: IconUtils.workspace(),
    members,
    owner: members[0],
    permissions: {
      [acc_1.id]: defaultPermissions[PermissionRoles.OWNER],
      [non_acc[0].id]: defaultPermissions[PermissionRoles.VIEWER],
      [non_acc[1].id]: defaultPermissions[PermissionRoles.VIEWER],
    },
    single: false,
  });
};
