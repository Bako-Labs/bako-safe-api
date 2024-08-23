import type { DeployTransfer } from 'bakosafe';
import { TransactionType, ZeroBytes32 } from 'fuels';
import { TAI64 } from 'tai64';

import type { SuccessStatus } from '@/generated';
import { AuthService, TransactionService } from '@/service';
import { toTransaction } from '@/utils';

export const submitAndAwait = {
  subscribe: async function* (_, args, context) {
    const { apiToken, userId, database } = context;

    const transaction = toTransaction(args.tx);

    try {
      if (transaction.type !== TransactionType.Create) {
        throw new Error('Only TransactionType.Create are supported');
      }

      const authService = new AuthService(database);
      const transactionService = new TransactionService(
        transaction,
        authService,
      );
      const submitResponse = await transactionService.submit({
        apiToken,
        userId,
      });
      const { deployTransfer, vault } = submitResponse;

      console.log('[SUBSCRIPTION] Transaction sent to Bako', {
        vault: vault.BakoSafeVaultId,
        address: vault.address.toAddress(),
        transactionId: deployTransfer.getHashTxId(),
      });

      yield deployTransfer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  resolve: (payload: DeployTransfer) => {
    return {
      __typename: 'SuccessStatus',
      transactionId: `0x${payload.getHashTxId()}`,
      blockHeight: '0',
      block: {
        consensus: {},
        transactions: [],
        id: ZeroBytes32,
        height: '0',
        header: {
          applicationHash: ZeroBytes32,
          consensusParametersVersion: '0',
          daHeight: '0',
          eventInboxRoot: ZeroBytes32,
          height: '0',
          id: ZeroBytes32,
          messageOutboxRoot: ZeroBytes32,
          messageReceiptCount: '0',
          prevRoot: ZeroBytes32,
          stateTransitionBytecodeVersion: '0',
          time: TAI64.now().toUnix().toString(),
          transactionsCount: '2',
          transactionsRoot: ZeroBytes32,
        },
      },
      time: TAI64.now().toUnix().toString(),
      receipts: [],
      totalGas: '1063605',
      totalFee: '11561',
    } as SuccessStatus;
  },
};
