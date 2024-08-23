import { DEFAULT_TRANSACTION_TITLE, type Predicate } from '@src/models';
import { SetupApi } from '@src/utils/testUtils/setup';
import type { AuthValidations } from '@utils/testUtils/Auth';
import { TestError, catchApplicationError } from '@utils/testUtils/Errors';

const tokenMock = {
  name: 'Test API Token',
  config: {
    transactionTitle: 'BakoSafe contract deployment',
  },
};

describe('[API TOKEN]', () => {
  let api: AuthValidations;
  let predicate: Predicate;
  let notWorkspaceMemberApi: AuthValidations;
  let notFoundPermissionApi: AuthValidations;

  beforeAll(async () => {
    const setup = await SetupApi.setup();

    api = setup.api;
    predicate = setup.predicate;
    notWorkspaceMemberApi = setup.notWorkspaceMemberApi;
    notFoundPermissionApi = setup.notFoundPermissionApi;
  });

  describe('Create', () => {
    test(
      'Create a api token for vault',
      async () => {
        const { data: apiTokenWithTitle } = await api.axios.post(
          `/api-token/${predicate.id}`,
          tokenMock,
        );

        expect(apiTokenWithTitle.token).toBeDefined();
        expect(apiTokenWithTitle.name).toBe(tokenMock.name);
        expect(apiTokenWithTitle.config.transactionTitle).toBe(
          tokenMock.config.transactionTitle,
        );

        const { data: apiTokenWithoutTitle } = await api.axios.post(
          `/api-token/${predicate.id}`,
          {
            ...tokenMock,
            config: undefined,
          },
        );

        expect(apiTokenWithoutTitle.id).toBeDefined();
        expect(apiTokenWithoutTitle.token).toBeDefined();
        expect(apiTokenWithoutTitle.name).toBe(tokenMock.name);
        expect(apiTokenWithoutTitle.config.transactionTitle).toBe(
          DEFAULT_TRANSACTION_TITLE,
        );
      },
      10 * 1000,
    );

    test('Body and params on create api token', async () => {
      // Error on missing required fields
      const payloadError = await catchApplicationError(
        api.axios.post(`/api-token/${predicate.id}`, {}),
      );
      TestError.expectValidation(payloadError, {
        type: 'any.required',
        field: 'name',
        origin: 'body',
      });

      // Error on invalid predicate id
      const predicateError = await catchApplicationError(
        api.axios.post('/api-token/invalid-id', tokenMock),
      );
      TestError.expectValidation(predicateError, {
        type: 'string.guid',
        field: 'predicateId',
        origin: 'params',
      });
    });

    test('Permissions on create api token', async () => {
      // Error on not found predicate
      const notFoundError = await catchApplicationError(
        api.axios.post(
          '/api-token/9328ed43-31c7-428a-bb73-c03534bf34f0',
          tokenMock,
        ),
      );
      TestError.expectNotFound(notFoundError);

      // Error on not allowed predicate
      const notWorkspaceMemberError = await catchApplicationError(
        notWorkspaceMemberApi.axios.post(
          `/api-token/${predicate.id}`,
          tokenMock,
        ),
      );
      TestError.expectUnauthorized(notWorkspaceMemberError);

      // Error on not allowed predicate
      const notFoundPermissionError = await catchApplicationError(
        notFoundPermissionApi.axios.post(
          `/api-token/${predicate.id}`,
          tokenMock,
        ),
      );
      TestError.expectUnauthorized(notFoundPermissionError);
    });
  });

  describe('Delete', () => {
    test('Delete a api token', async () => {
      const { data: apiToken } = await api.axios.post(
        `/api-token/${predicate.id}`,
        tokenMock,
      );

      const { data, status } = await api.axios.delete(
        `/api-token/${predicate.id}/${apiToken.id}`,
      );
      expect(data).toBeNull();
      expect(status).toBe(201);
    });

    test('Not a member of workspace', async () => {
      const { data: apiToken } = await api.axios.post(
        `/api-token/${predicate.id}`,
        tokenMock,
      );

      const notWorkspaceMemberError = await catchApplicationError(
        notWorkspaceMemberApi.axios.delete(
          `/api-token/${predicate.id}/${apiToken.id}`,
        ),
      );
      TestError.expectUnauthorized(notWorkspaceMemberError);
    });

    test('Not found permission in workspace', async () => {
      const { data: apiToken } = await api.axios.post(
        `/api-token/${predicate.id}`,
        tokenMock,
      );

      // Error on not allowed predicate
      const notFoundPermissionError = await catchApplicationError(
        notFoundPermissionApi.axios.delete(
          `/api-token/${predicate.id}/${apiToken.id}`,
        ),
      );
      TestError.expectUnauthorized(notFoundPermissionError);
    });
  });

  describe('List', () => {
    test('List api tokens', async () => {
      await api.axios.post(`/api-token/${predicate.id}`, tokenMock);

      const { data } = await api.axios.get(`/api-token/${predicate.id}`);
      const [token] = data;

      expect(token.id).toBeDefined();
      expect(token.token).not.toBeDefined();
    });

    test('Not a member of workspace', async () => {
      const notWorkspaceMemberError = await catchApplicationError(
        notWorkspaceMemberApi.axios.get(`/api-token/${predicate.id}`),
      );

      TestError.expectUnauthorized(notWorkspaceMemberError);
    });

    test('Not found permission in workspace', async () => {
      const notFoundPermissionError = await catchApplicationError(
        notFoundPermissionApi.axios.get(`/api-token/${predicate.id}`),
      );

      TestError.expectUnauthorized(notFoundPermissionError);
    });
  });
});
