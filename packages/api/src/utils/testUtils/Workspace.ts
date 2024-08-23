import { Address } from 'fuels';

import { TypeUser } from '@src/models';

import { BakoSafe } from 'bakosafe';
import { type IAccountKeys, accounts } from '../../mocks/accounts';
import type { AuthValidations } from './Auth';

const generateUser = async (api: AuthValidations, address?: IAccountKeys) => {
  const addRandom = Address.fromRandom().toAddress();
  const { data } = await api.axios.post('/user/', {
    address: address ? accounts[address].address : addRandom,
    provider: BakoSafe.getProviders('CHAIN_URL'),
    name: `${new Date().getTime()} - Create user test`,
    type: TypeUser.FUEL,
  });

  return {
    id: data.userId,
    address: addRandom,
    name: data.name,
    type: TypeUser.FUEL,
  };
};

const generateWorkspacePayload = async (api: AuthValidations) => {
  const data_user1 = await generateUser(api);
  const data_user2 = await generateUser(api);
  const USER_5 = await generateUser(api, 'USER_5');
  const USER_3 = await generateUser(api, 'USER_3');

  const { data, status } = await api.axios.post('/workspace/', {
    name: `[GENERATED] Workspace 1 ${new Date()}`,
    description: '[GENERATED] Workspace 1 description',
    members: [
      data_user1.id,
      data_user2.id,
      USER_5.id,
      USER_3.id,
      Address.fromRandom().toAddress(),
    ],
  });

  return { data, status, data_user1, data_user2, USER_5 };
};

export { generateWorkspacePayload, generateUser };
