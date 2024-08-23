import { networks } from '@mocks/networks';
import { PredicateMock } from '@mocks/predicate';
import { AuthValidations } from '@utils/testUtils/Auth';
import { generateWorkspacePayload } from '@utils/testUtils/Workspace';
import { accounts } from 'bakosafe';

export class SetupApi {
  static async setup() {
    const api = await SetupApi.defaultApi();

    const {
      data_user1,
      data_user2,
      data: workspace,
    } = await generateWorkspacePayload(api);
    await api.selectWorkspace(workspace.id);

    const members = [data_user1.address, data_user2.address];
    const { predicatePayload } = await PredicateMock.create(1, members);

    const { data: predicate } = await api.axios.post(
      '/predicate',
      predicatePayload,
    );

    const notWorkspaceMemberApi = await SetupApi.notWorkspaceMemberApi();
    const notFoundPermissionApi = await SetupApi.notFoundPermissionApi(
      predicate.workspace.id,
    );

    return {
      api,
      predicate,
      notFoundPermissionApi,
      notWorkspaceMemberApi,
    };
  }

  static async defaultApi() {
    return AuthValidations.authenticateUser({
      account: accounts.USER_1,
      provider: networks.local,
    });
  }

  static async notWorkspaceMemberApi() {
    return AuthValidations.authenticateUser({
      account: accounts.USER_2,
      provider: networks.local,
    });
  }

  static async notFoundPermissionApi(workspaceId: string) {
    return AuthValidations.authenticateWorkspace({
      account: accounts.USER_3,
      provider: networks.local,
      workspaceId,
    });
  }
}
