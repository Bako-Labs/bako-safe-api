import { type DeployTransfer, type ITransactionSummary, Vault } from 'bakosafe';
import {
  OperationName,
  type Provider,
  type TransactionCreate,
  getTransactionSummaryFromRequest,
} from 'fuels';

import type { AuthService } from '@/service/auth';

type SubmitParams = {
  userId: string;
  apiToken: string;
};

type SetSummaryParams = {
  transfer: DeployTransfer;
  provider: Provider;
};

export class TransactionService {
  private readonly transaction: TransactionCreate;
  private authService: AuthService;

  constructor(transaction: TransactionCreate, authService: AuthService) {
    this.authService = authService;
    this.transaction = transaction;
  }

  async submit({ apiToken, userId }: SubmitParams) {
    const { code, vaultId, userAddress, tokenConfig } =
      await this.authService.getSession(apiToken, userId);

    const vault = await Vault.create({
      id: vaultId,
      address: userAddress,
      token: code.value,
    });

    const deployTransfer = await vault.BakoSafeDeployContract({
      ...this.transaction,
      name: tokenConfig.transactionTitle,
    });

    await this.setTransactionSummary({
      transfer: deployTransfer,
      provider: vault.provider,
    });
    await this.authService.closeSession(code.id);

    return {
      vault,
      deployTransfer,
    };
  }

  private async setTransactionSummary({
    transfer,
    provider,
  }: SetSummaryParams) {
    const summaryFromRequest = await getTransactionSummaryFromRequest({
      transactionRequest: transfer.transactionRequest,
      provider,
    });
    summaryFromRequest.operations = summaryFromRequest.operations.map(
      (operation) => {
        if (operation.name === OperationName.contractCreated) {
          operation.assetsSent = [
            {
              assetId: provider.getBaseAssetId(),
              amount: transfer.transactionRequest.maxFee,
            },
          ];
        }

        return operation;
      },
    );

    const transactionSummary: ITransactionSummary = {
      type: 'cli',
      operations: summaryFromRequest.operations,
    };

    const query = `
				UPDATE transactions
				SET summary = $1
				WHERE id = $2
    `;

    await this.authService.database.query(query, [
      JSON.stringify(transactionSummary),
      transfer.BakoSafeTransactionId,
    ]);
  }
}
