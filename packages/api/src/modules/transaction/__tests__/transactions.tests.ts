import {
  BakoSafe,
  type IPayloadVault,
  TransactionStatus,
  Vault,
} from 'bakosafe';
import { Address, Provider, Wallet, ZeroBytes32, bn, hash } from 'fuels';

import { accounts } from '@src/mocks/accounts';
import { networks } from '@src/mocks/networks';
import { PredicateMock } from '@src/mocks/predicate';
import { transaction, transactionMock } from '@src/mocks/transaction';
import { assetsMapBySymbol } from '@src/utils/assets';
import { AuthValidations } from '@src/utils/testUtils/Auth';
import { signBypK } from '@src/utils/testUtils/Wallet';
import { generateWorkspacePayload } from '@src/utils/testUtils/Workspace';
import { TestError, catchApplicationError } from '@utils/testUtils/Errors';

describe('[TRANSACTION]', () => {
  let api: AuthValidations;

  beforeAll(async () => {
    api = new AuthValidations(networks.local, accounts.USER_1);

    await api.create();
    await api.createSession();
  });

  test(
    'Create transaction',
    async () => {
      const user_aux = Address.fromRandom().toString();
      const members = [accounts.USER_1.address, user_aux];
      const { predicatePayload, vault } = await PredicateMock.create(
        1,
        members,
      );
      await api.axios.post('/predicate', predicatePayload);

      const { tx, payload_transfer } = await transactionMock(vault);

      const { data: data_transaction } = await api.axios.post(
        '/transaction',
        payload_transfer,
      );

      expect(data_transaction).toHaveProperty('id');
      expect(data_transaction).toHaveProperty(
        'predicate.predicateAddress',
        vault.address.toB256(),
      );
      expect(data_transaction).toHaveProperty('assets');
      expect(data_transaction).toHaveProperty('resume.witnesses');
      expect(data_transaction.resume.witnesses).toHaveLength(members.length);
      expect(tx.getHashTxId()).toEqual(data_transaction.hash);
    },
    60 * 1000,
  );

  test(
    'Error when creating transaction with invalid payload',
    async () => {
      const payload = {
        predicateAddress: 'invalid_address',
        name: `[TESTE_MOCK] ${Address.fromRandom().toString()}`,
        hash: ZeroBytes32,
        txData: {},
        status: TransactionStatus.AWAIT_REQUIREMENTS,
        assets: [],
      };
      const payloadError = await catchApplicationError(
        api.axios.post('/transaction', payload),
      );
      TestError.expectValidation(payloadError, {
        type: 'custom',
        field: 'Invalid address',
        origin: 'body',
      });
    },
    60 * 1000,
  );

  test(
    'Create transaction with invalid permission',
    async () => {
      // logar com usuário inválido no workspace
      const auth = new AuthValidations(networks.local, accounts.USER_3);

      await auth.create();
      await auth.createSession();

      const {
        data_user1,
        data_user2,
        data: workspace,
      } = await generateWorkspacePayload(auth);
      await auth.selectWorkspace(workspace.id);

      //gerar um predicate
      const members = [data_user1.address, data_user2.address];

      const { predicatePayload, vault } = await PredicateMock.create(
        1,
        members,
      );
      await auth.axios.post('/predicate', predicatePayload);

      const aux_auth = new AuthValidations(networks.local, accounts.USER_5);
      await aux_auth.create();
      await aux_auth.createSession();
      await aux_auth.selectWorkspace(workspace.id);

      //gerar uma transacao com um usuário inválido
      const { payload_transfer } = await transactionMock(vault);
      const { status: status_transaction, data: data_transaction } =
        await aux_auth.axios
          .post('/transaction', payload_transfer)
          .catch((e) => {
            return e.response;
          });

      //validacoes
      expect(status_transaction).toBe(401);
      expect(data_transaction).toHaveProperty(
        'detail',
        'You do not have permission to access this resource',
      );
    },
    60 * 1000,
  );

  test(
    'Create transaction with vault member',
    async () => {
      // logar com usuário inválido no workspace
      const auth = new AuthValidations(networks.local, accounts.USER_5);
      await auth.create();
      await auth.createSession();
      const { data_user1, data_user2, USER_5 } =
        await generateWorkspacePayload(auth);

      //gerar um predicate
      const members = [data_user1.address, data_user2.address, USER_5.address];

      const { predicatePayload, vault } = await PredicateMock.create(
        1,
        members,
      );
      await api.axios.post('/predicate', predicatePayload);

      //gerar uma transacao com um usuário inválido
      const { payload_transfer } = await transactionMock(vault);
      const { status: status_transaction } = await auth.axios.post(
        '/transaction',
        payload_transfer,
      );

      //validacoes
      expect(status_transaction).toBe(200);
    },
    60 * 1000,
  );

  test('List transactions', async () => {
    const auth = new AuthValidations(networks.local, accounts.USER_5);
    await auth.create();
    await auth.createSession();

    //on single workspace
    await auth.axios.get('/transaction').then(({ data, status }) => {
      expect(status).toBe(200);
      let prev = undefined;

      data.forEach((element, index) => {
        const aux = element.predicate;
        if (prev && index > 0) {
          expect(new Date(prev).getTime()).toBeGreaterThan(
            new Date(element.updatedAt).getTime(),
          );
        }
        prev = element.updatedAt;

        expect(aux).toHaveProperty('id');
        expect(aux).toHaveProperty('predicateAddress');
        expect(aux.workspace).toHaveProperty('id');
        expect(aux.workspace).toHaveProperty('name');
      });
    });

    //with pagination
    const page = 1;
    const perPage = 9;
    await auth.axios
      .get(`/transaction?page=${page}&perPage=${perPage}`)
      .then(({ data, status }) => {
        expect(status).toBe(200);
        expect(data).toHaveProperty('data');
        expect(data.data.length).toBeLessThanOrEqual(perPage);
        expect(data).toHaveProperty('total');
        expect(data).toHaveProperty('currentPage', page);
        expect(data).toHaveProperty('perPage', perPage);
      });

    const _status = [
      TransactionStatus.AWAIT_REQUIREMENTS,
      TransactionStatus.PENDING_SENDER,
    ];
    await auth.axios
      .get(`/transaction?status=${_status[0]}&status=${_status[1]}`)
      .then(({ data, status }) => {
        expect(status).toBe(200);
        data.forEach((element) => {
          const aux = _status.includes(element.status);
          expect(aux).toBe(true);
        });
      });

    //an another workspace
    const { data: data_workspace } = await generateWorkspacePayload(auth);
    await auth.selectWorkspace(data_workspace.id);
    await auth.axios.get('/transaction').then(({ data, status }) => {
      expect(status).toBe(200);
      expect(data).toHaveLength(0);
    });

    // by month
    await auth.axios
      .get('/transaction?byMonth=true')
      .then(({ data, status }) => {
        expect(status).toBe(200);
        expect(data).toHaveProperty('data');
        expect(data.data).toBeInstanceOf(Array);
      });
  });

  test('Should save missing deposits in db', async () => {
    // Gerando autenticação
    const auth = new AuthValidations(networks.local, accounts.USER_1);
    await auth.create();
    await auth.createSession();

    const provider = await Provider.create(networks.local);

    // Criar predicate novo
    const VaultPayload: IPayloadVault = {
      configurable: {
        SIGNATURES_COUNT: 1,
        SIGNERS: [accounts.USER_1.address],
        network: provider.url,
      },
      BakoSafeAuth: auth.authToken,
    };

    const vault = await Vault.create(VaultPayload);

    // Usando conta genesis para enviar transação para esse predicate
    const wallet = Wallet.fromPrivateKey(accounts.FULL.privateKey, provider);

    // Transferindo moedas para o predicate recem criado pela genesis wallet
    const transfer1 = await wallet.transfer(
      vault.address,
      bn.parseUnits('0.10'),
      assetsMapBySymbol.ETH.id,
      {
        maxFee: BakoSafe.getGasConfig('MAX_FEE'),
        gasLimit: BakoSafe.getGasConfig('GAS_LIMIT'),
      },
    );

    const transfer2 = await wallet.transfer(
      vault.address,
      bn.parseUnits('0.10'),
      assetsMapBySymbol.BTC.id,
      {
        maxFee: BakoSafe.getGasConfig('MAX_FEE'),
        gasLimit: BakoSafe.getGasConfig('GAS_LIMIT'),
      },
    );

    await transfer1.waitForResult();
    await transfer2.waitForResult();

    // Criando de fato a transação agora que o predicate tem moedas pra isso
    const tx = await vault.BakoSafeIncludeTransaction({
      name: 'Test 1',
      assets: [
        {
          amount: '0.01',
          assetId: assetsMapBySymbol.ETH.id,
          to: vault.address.toB256(),
        },
        {
          amount: '0.01',
          assetId: assetsMapBySymbol.BTC.id,
          to: vault.address.toB256(),
        },
      ],
    });

    // Assinando a transação recem criada
    await auth.axios.put(`/transaction/signer/${tx.BakoSafeTransactionId}`, {
      account: accounts.USER_1.address,
      signer: await signBypK(tx.getHashTxId(), accounts.USER_1.privateKey),
      confirm: true,
    });

    await tx.send();
    await tx.wait();

    const id_vault = vault.BakoSafeVault.id;

    // Buscando as transações desse novo vault, deve ter apenas 1 (const tx)
    const { data: transactions } = await auth.axios.get('/transaction', {
      params: {
        predicateId: [id_vault],
      },
    });

    // validação para ter apenas 1
    expect(transactions.length).toBe(1);
    // confirmando se o nome é igual ao da tx criada
    expect(transactions[0].name).toEqual(tx.name);

    // Batendo no endpoint onde busca pelos depositos e salva os pendentes.
    await auth.axios.get(`/predicate/${id_vault}`);

    const transfer1Id = transfer1.id;
    const transfer2Id = transfer2.id;

    // Buscando as transações do vault mais uma vez, após os depositos salvos
    const { data: transactionsAfterDeposit } = await auth.axios.get(
      '/transaction',
      {
        params: {
          predicateId: [id_vault],
        },
      },
    );

    // O motivo do slice(8) no nome das transações que vêm do banco é que os depósitos são salvos como
    // DEPOSIT_${deposit.id}, então o slice(8) remove o DEPOSIT_, assim comparando apenas o id
    const checkTransactionName = (transactions, name) =>
      transactions.some((tx) => tx.name.slice(8) === name || tx.name === name);

    expect(transactionsAfterDeposit.length === 3);

    expect(
      checkTransactionName(transactionsAfterDeposit, transfer1Id),
    ).toBeTruthy();
    expect(
      checkTransactionName(transactionsAfterDeposit, transfer2Id),
    ).toBeTruthy();
    expect(
      checkTransactionName(transactionsAfterDeposit, tx.name),
    ).toBeTruthy();
  });

  test(
    'Throw an error when witness that has a status different from pending try to sign a transaction',
    async () => {
      // logar com usuário inválido no workspace
      const auth = new AuthValidations(networks.local, accounts.USER_5);
      await auth.create();
      await auth.createSession();
      const { USER_5 } = await generateWorkspacePayload(auth);

      const members = [USER_5.address];

      const { predicatePayload, vault } = await PredicateMock.create(
        1,
        members,
      );
      await api.axios.post('/predicate', predicatePayload);

      //gerar uma transacao com um usuário inválido
      const { payload_transfer } = await transactionMock(vault);

      const { data } = await auth.axios.post('/transaction', payload_transfer);

      const signature = await auth.signer(payload_transfer.hash);

      // recusando a transação/assinatura
      const declineTransaction = await auth.axios.put(
        `/transaction/signer/${data.id}`,
        {
          account: data.resume.witnesses[0].account,
          confirm: false,
          signer: signature,
        },
      );
      // recusando ou assinando, sempre é retornado verdadeiro
      expect(declineTransaction.data).toBeTruthy();

      // Confirmando/assinando a transação depois da mesma ser recusada
      const confirmTransaction = auth.axios.put(
        `/transaction/signer/${data.id}`,
        {
          account: data.resume.witnesses[0].account,
          confirm: true,
          signer: signature,
        },
      );

      await expect(confirmTransaction).rejects.toMatchObject({
        response: {
          data: {
            detail: 'Transaction was already declined.',
          },
        },
      });
    },
    60 * 1000,
  );
});
