import { Address } from 'fuels';

import { accounts } from '@src/mocks/accounts';
import { networks, providers } from '@src/mocks/networks';
import { TypeUser } from '@src/models';
import { PermissionRoles, defaultPermissions } from '@src/models/Workspace';
import { AuthValidations } from '@src/utils/testUtils/Auth';
import { generateWorkspacePayload } from '@src/utils/testUtils/Workspace';
import { TestError, catchApplicationError } from '@utils/testUtils/Errors';
import { BakoSafe } from 'bakosafe';

describe('[WORKSPACE]', () => {
  let api: AuthValidations;
  beforeAll(async () => {
    api = new AuthValidations(networks.local, accounts.USER_1);

    await api.create();
    await api.createSession();
  });

  test(
    'List all workspaces to user',
    async () => {
      //list workspaces
      await api.axios.get('/workspace/by-user').then(({ data, status }) => {
        expect(status).toBe(200);
        expect(data).toBeInstanceOf(Array);
        data.forEach((element) => {
          expect(element).toHaveProperty('id');
          expect(element).toHaveProperty('name');
          expect(element).toHaveProperty('owner_id');
          expect(element).toHaveProperty('single', false);
          expect(element).toHaveProperty('permissions');
          expect(element).toHaveProperty('predicates');
          expect(element).toHaveProperty('members');
        });
      });
    },
    40 * 1000,
  );

  test(
    'Create workspace',
    async () => {
      const { data, status } = await generateWorkspacePayload(api);
      const notOwner = data.members.filter((m) => m.id !== data.owner.id);

      expect(status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('owner');
      expect(data).toHaveProperty('members');
      expect(data).toHaveProperty('single', false);
      expect(data.members).toHaveLength(notOwner.length + 1);
      for (const member of notOwner) {
        expect(data.permissions[member.id]).toStrictEqual(
          defaultPermissions[PermissionRoles.VIEWER],
        );
      }
      expect(data.permissions[data.owner.id]).toStrictEqual(
        defaultPermissions[PermissionRoles.OWNER],
      );
    },
    60 * 1000,
  );

  test(
    'Error when creating workspace with invalid payload',
    async () => {
      const payloadError = await catchApplicationError(
        api.axios.post('/workspace/', {
          name: `[GENERATED] Workspace 1 ${new Date()}`,
          description: '[GENERATED] Workspace 1 description',
          members: ['asd'],
        }),
      );
      TestError.expectValidation(payloadError, {
        type: 'alternatives.match',
        field: 'Invalid member address or id',
        origin: 'body',
      });
    },
    60 * 1000,
  );

  test(
    'Find workspace by ID',
    async () => {
      const { data } = await generateWorkspacePayload(api);

      const { data: workspace, status: status_find } = await api.axios.get(
        `/workspace/${data.id}`,
      );

      expect(status_find).toBe(200);
      expect(workspace).toHaveProperty('id');
      expect(workspace.id).toBe(data.id);
      expect(workspace).toHaveProperty('owner');
      expect(workspace.owner).toEqual(data.owner);
      expect(workspace).toHaveProperty('members');
      expect(workspace.members).toHaveLength(data.members.length);
      expect(workspace).toHaveProperty('name', data.name);
      expect(workspace).toHaveProperty('predicates');
    },
    60 * 1000,
  );

  test('Update workspace', async () => {
    const auth_aux = new AuthValidations(networks.local, accounts.USER_5);
    await auth_aux.create();
    await auth_aux.createSession();

    const { data } = await generateWorkspacePayload(auth_aux);
    await auth_aux.selectWorkspace(data.id);

    await auth_aux.selectWorkspace(data.id);

    const { data: workspace, status: status_find } = await auth_aux.axios.get(
      `/workspace/${data.id}`,
    );

    const { data: workspace_updated, status: status_update } =
      await auth_aux.axios.put('/workspace', {
        name: 'Workspace 1 updated',
        description: 'Workspace 1 description updated',
      });

    expect(status_find).toBe(200);
    expect(workspace).toHaveProperty('id');
    expect(workspace.id).toBe(data.id);
    expect(workspace).toHaveProperty('owner');
    expect(workspace.owner).toEqual(data.owner);
    expect(workspace).toHaveProperty('members');
    expect(workspace.members).toHaveLength(data.members.length);

    expect(status_update).toBe(200);
    expect(workspace_updated).toHaveProperty('id');
    expect(workspace_updated.id).toBe(data.id);
    expect(workspace_updated).toHaveProperty('owner');
    expect(workspace_updated.owner).toEqual(data.owner);
    expect(workspace_updated).toHaveProperty('members');
    expect(workspace_updated.members).toHaveLength(data.members.length);
    expect(workspace_updated).toHaveProperty('name', 'Workspace 1 updated');
    expect(workspace_updated).toHaveProperty(
      'description',
      'Workspace 1 description updated',
    );
  });

  test('Inválid permission to update workspace', async () => {
    try {
      const { data } = await generateWorkspacePayload(api);

      await api.selectWorkspace(data.id);

      await api.axios.put('/workspace', {
        name: 'Workspace 1 updated',
        description: 'Workspace 1 description updated',
      });
    } catch (e) {
      expect(e.response.status).toBe(401);
      expect(e.response.data.errors.detail).toEqual(
        'You do not have permission to access this resource',
      );
    }
  });

  test(
    'Upgrade workspace permissions',
    async () => {
      const auth_aux = new AuthValidations(networks.local, accounts.USER_5);
      await auth_aux.create();
      await auth_aux.createSession();
      const { data, data_user1, data_user2 } =
        await generateWorkspacePayload(auth_aux);

      await auth_aux.selectWorkspace(data.id);

      //update permission
      await auth_aux.axios
        .put(`/workspace/permissions/${data_user1.id}`, {
          permissions: defaultPermissions[PermissionRoles.MANAGER],
        })
        .then(({ data, status }) => {
          expect(status).toBe(200);
          expect(data).toHaveProperty('id');
          expect(data).toHaveProperty('owner');
          expect(data).toHaveProperty('members');
          expect(data).toHaveProperty('permissions');
          expect(data.permissions[data_user1.id]).toHaveProperty(
            [PermissionRoles.MANAGER][0],
            ['*'],
          );
        });

      //update owner
      await auth_aux.axios
        .put(`/workspace/permissions/${data.owner.id}`, {
          permissions: defaultPermissions[PermissionRoles.MANAGER],
        })
        .catch(({ response }) => {
          expect(response.status).toBe(401);
          expect(response.data.detail).toEqual(
            'Owner cannot change his own permissions',
          );
        });

      //update without permission
      await api.axios
        .put(`/workspace/permissions/${data_user2.id}`, {
          permissions: defaultPermissions[PermissionRoles.MANAGER],
        })
        .catch(({ response }) => {
          expect(response.status).toBe(401);
          expect(response.data.errors.detail).toEqual(
            'You do not have permission to access this resource',
          );
        });
    },
    40 * 1000,
  );

  test('Upgrade workspace members', async () => {
    const auth_aux = new AuthValidations(networks.local, accounts.USER_5);
    await auth_aux.create();
    await auth_aux.createSession();
    const { data } = await generateWorkspacePayload(auth_aux);
    await auth_aux.selectWorkspace(data.id);

    const aux_address = Address.fromRandom();
    const { data: data_user_aux } = await auth_aux.axios.post('/user/', {
      address: aux_address.toAddress(),
      provider: BakoSafe.getProviders('CHAIN_URL'),
      name: `${new Date().getTime()} - Create user test`,
      type: TypeUser.FUEL,
    });

    const { data: workspace } = await auth_aux.axios.get(
      `/workspace/${data.id}`,
    );

    let quantityMembers = workspace.members.length;

    //include exists on database member
    await auth_aux.axios
      .post(`/workspace/members/${data_user_aux.userId}/include`)
      .then(({ data, status }) => {
        quantityMembers++;
        expect(status).toBe(200);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('owner');
        expect(data).toHaveProperty('members');
        expect(data.members).toHaveLength(quantityMembers);
        expect(
          data.members.find((m) => m.address === aux_address.toB256()),
        ).toBeDefined();
        expect(data).toHaveProperty('permissions');
      });

    // //include not exists on database member (create)
    const aux_byAddress = Address.fromRandom();
    await auth_aux.axios
      .post(`/workspace/members/${aux_byAddress.toAddress()}/include`)
      .then(({ data, status }) => {
        quantityMembers++;
        expect(status).toBe(200);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('owner');
        expect(data).toHaveProperty('members');
        expect(
          data.members.find((m) => m.address === aux_byAddress.toB256()),
        ).toBeDefined();
        expect(data.members).toHaveLength(quantityMembers);
        expect(data).toHaveProperty('permissions');
      });

    //remove member
    await auth_aux.axios
      .post(`/workspace/members/${data_user_aux.userId}/remove`)
      .then(({ data, status }) => {
        quantityMembers--;
        expect(status).toBe(200);
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('owner');
        expect(data).toHaveProperty('members');
        expect(data.members).toHaveLength(quantityMembers);
        expect(data.members).not.toContainEqual(data_user_aux);
        expect(data).toHaveProperty('permissions');
      });

    //remove owner
    await auth_aux.axios
      .post(`/workspace/members/${workspace.owner.id}/remove`)
      .catch(({ response }) => {
        expect(response.status).toBe(401);
        expect(response.data.detail).toEqual(
          'Owner cannot be removed from workspace',
        );
      });

    // //update without permission
    await api.axios
      .post(`/workspace/members/${data_user_aux.userId}/include`)
      .catch(({ response }) => {
        expect(response.status).toBe(401);
        expect(response.data.errors.detail).toEqual(
          'You do not have permission to access this resource',
        );
      });
  });

  // get balance of workspace
  test(
    'get balance of workspace',
    async () => {
      await api.axios.get('/workspace/balance').then(({ data, status }) => {
        expect(status).toBe(200);
      });
    },
    100 * 1000,
  );
});
