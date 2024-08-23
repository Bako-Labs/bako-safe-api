import {
  // BakoError,
  type IWitnesses,
  TransactionProcessStatus,
  TransactionStatus,
  type Transfer,
  type Vault,
  WitnessStatus,
} from 'bakosafe';
import {
  Address,
  TransactionType as FuelTransactionType,
  OutputType,
  Provider,
  type TransactionRequest,
  TransactionResponse,
  getTransactionSummary,
  getTransactionsSummaries,
  hexlify,
  transactionRequestify,
} from 'fuels';
import { Brackets } from 'typeorm';

import { EmailTemplateType, sendMail } from '@src/utils/EmailSender';

import { NotificationTitle, type Predicate, Transaction } from '@models/index';

import { NotFound } from '@utils/error';
import GeneralError, { ErrorTypes } from '@utils/error/GeneralError';
import Internal from '@utils/error/Internal';
import { type IOrdination, setOrdination } from '@utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@utils/pagination';

import { NotificationService } from '../notification/services';
import {
  TransactionPagination,
  type TransactionPaginationParams,
} from './pagination';
import type {
  ICreateTransactionPayload,
  ITransactionFilterParams,
  ITransactionResponse,
  ITransactionService,
  ITransactionsGroupedByMonth,
  IUpdateTransactionPayload,
} from './types';
import {
  formatFuelTransaction,
  formatTransactionsResponse,
  groupedTransactions,
} from './utils';

export class TransactionService implements ITransactionService {
  private _ordination: IOrdination<Transaction> = {
    orderBy: 'updatedAt',
    sort: 'DESC',
  };
  private _pagination: PaginationParams;
  private _transactionPagination: TransactionPaginationParams;
  private _filter: ITransactionFilterParams;

  filter(filter: ITransactionFilterParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  transactionPaginate(pagination?: TransactionPaginationParams) {
    this._transactionPagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<Transaction>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async create(
    payload: ICreateTransactionPayload,
  ): Promise<ITransactionResponse> {
    return await Transaction.create(payload)
      .save()
      .then((transaction) => Transaction.formatTransactionResponse(transaction))
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction creation',
          detail: e,
        });
      });
  }

  async update(
    id: string,
    payload?: IUpdateTransactionPayload,
  ): Promise<ITransactionResponse> {
    return await Transaction.update({ id }, payload)
      .then(async () => {
        return await this.findById(id);
      })
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction update',
          detail: e,
        });
      });
  }

  async findById(id: string): Promise<ITransactionResponse> {
    return await Transaction.findOne({
      where: { id },
      relations: [
        'predicate',
        'predicate.members',
        'predicate.workspace',
        'predicate.version',
        'createdBy',
      ],
    })
      .then((transaction) => {
        if (!transaction) {
          throw new NotFound({
            type: ErrorTypes.NotFound,
            title: 'Transaction not found',
            detail: `No transaction was found for the provided ID: ${id}.`,
          });
        }

        return Transaction.formatTransactionResponse(transaction);
      })
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction findById',
          detail: e,
        });
      });
  }

  //todo: melhorar a valocidade de processamento dessa query
  //caso trocar inner por left atrapalha muito a performance
  async list(): Promise<
    | IPagination<ITransactionResponse>
    | ITransactionResponse[]
    | IPagination<ITransactionsGroupedByMonth>
    | ITransactionsGroupedByMonth
  > {
    const hasPagination = this._pagination?.page && this._pagination?.perPage;
    const queryBuilder = Transaction.createQueryBuilder('t')
      .select([
        't.createdAt',
        't.gasUsed',
        't.hash',
        't.id',
        't.name',
        't.predicateId',
        't.txData',
        't.resume',
        't.sendTime',
        't.status',
        't.summary',
        't.updatedAt',
        't.type',
      ])
      .leftJoin('t.predicate', 'predicate')
      .leftJoin('predicate.members', 'members')
      .leftJoin('predicate.workspace', 'workspace')
      .addSelect([
        'predicate.name',
        'predicate.id',
        'predicate.minSigners',
        'predicate.predicateAddress',
        'members.id',
        'members.avatar',
        'members.address',
        'workspace.id',
        'workspace.name',
        'workspace.single',
      ]);

    this._filter.predicateAddress &&
      queryBuilder.andWhere('predicate.predicateAddress = :address', {
        address: this._filter.predicateAddress,
      });

    // =============== specific for workspace ===============
    if (this._filter.workspaceId || this._filter.signer) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (this._filter.workspaceId) {
            qb.orWhere('workspace.id IN (:...workspace)', {
              workspace: this._filter.workspaceId,
            });
          }
          if (this._filter.signer) {
            qb.orWhere('members.address = :signer', {
              signer: this._filter.signer,
            });
          }
        }),
      );
    }

    // =============== specific for home ===============

    this._filter.to &&
      queryBuilder.andWhere(
        `
        EXISTS (
        SELECT 1
        FROM jsonb_array_elements(t.tx_data->'outputs') AS output
        WHERE (output->>'type')::int = :outputType
          AND (output->>'to')::text = :filterTo
      )`,
        { outputType: OutputType.Coin, filterTo: this._filter.to },
      );

    this._filter.hash &&
      queryBuilder.andWhere('LOWER(t.hash) = LOWER(:hash)', {
        hash: this._filter.hash,
      });

    this._filter.predicateId &&
      this._filter.predicateId.length > 0 &&
      queryBuilder.andWhere('t.predicate_id IN (:...predicateID)', {
        predicateID: this._filter.predicateId,
      });

    this._filter.status &&
      queryBuilder.andWhere('t.status IN (:...status)', {
        status: this._filter.status,
      });

    this._filter.startDate &&
      queryBuilder.andWhere('t.createdAt >= :startDate', {
        startDate: this._filter.startDate,
      });

    this._filter.endDate &&
      queryBuilder.andWhere('t.createdAt <= :endDate', {
        endDate: this._filter.endDate,
      });

    this._filter.createdBy &&
      queryBuilder.andWhere('t.createdBy = :createdBy', {
        createdBy: this._filter.createdBy,
      });

    this._filter.name &&
      queryBuilder.andWhere('LOWER(t.name) LIKE LOWER(:name)', {
        name: `%${this._filter.name}%`,
      });
    this._filter.id &&
      queryBuilder.andWhere('t.id = :id', {
        id: this._filter.id,
      });

    this._filter.type &&
      queryBuilder.andWhere('t.type = :type', {
        type: this._filter.type,
      });

    /* *
     * TODO: Not best solution for performance, "take" dont limit this method
     *       just find all and create an array with length. The best way is use
     *       distinct select.
     *  */
    this._filter.limit &&
      !hasPagination &&
      queryBuilder.take(this._filter.limit);

    queryBuilder.orderBy(
      `t.${this._ordination.orderBy}`,
      this._ordination.sort,
    );

    const handleInternalError = (e) => {
      if (e instanceof GeneralError) throw e;
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on transaction list',
        detail: e,
      });
    };

    const transactions = hasPagination
      ? await Pagination.create(queryBuilder)
          .paginate(this._pagination)
          .then((paginationResult) => paginationResult)
          .catch(handleInternalError)
      : await queryBuilder
          .getMany()
          .then((transactions) => {
            return transactions ?? [];
          })
          .catch(handleInternalError);

    const _transactions = formatTransactionsResponse(transactions);

    return this._filter.byMonth
      ? groupedTransactions(_transactions)
      : _transactions;
  }

  async listWithIncomings(): Promise<ITransactionResponse[]> {
    const hasPagination =
      this._transactionPagination?.perPage &&
      this._transactionPagination?.offsetDb;
    const queryBuilder = Transaction.createQueryBuilder('t')
      .select([
        't.createdAt',
        't.gasUsed',
        't.hash',
        't.id',
        't.name',
        't.predicateId',
        't.txData',
        't.resume',
        't.sendTime',
        't.status',
        't.summary',
        't.updatedAt',
        't.type',
      ])
      .leftJoin('t.predicate', 'predicate')
      .leftJoin('predicate.members', 'members')
      .leftJoin('predicate.workspace', 'workspace')
      .addSelect([
        'predicate.name',
        'predicate.id',
        'predicate.minSigners',
        'predicate.predicateAddress',
        'members.id',
        'members.avatar',
        'members.address',
        'workspace.id',
        'workspace.name',
        'workspace.single',
      ]);

    // =============== specific for workspace ===============
    if (this._filter.workspaceId || this._filter.signer) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (this._filter.workspaceId) {
            qb.orWhere('workspace.id IN (:...workspace)', {
              workspace: this._filter.workspaceId,
            });
          }
          if (this._filter.signer) {
            qb.orWhere('members.address = :signer', {
              signer: this._filter.signer,
            });
          }
        }),
      );
    }

    // =============== specific for home ===============

    this._filter.predicateId &&
      this._filter.predicateId.length > 0 &&
      queryBuilder.andWhere('t.predicate_id IN (:...predicateID)', {
        predicateID: this._filter.predicateId,
      });

    this._filter.status &&
      queryBuilder.andWhere('t.status IN (:...status)', {
        status: this._filter.status,
      });

    this._filter.type &&
      queryBuilder.andWhere('t.type = :type', {
        type: this._filter.type,
      });

    queryBuilder.orderBy(
      `t.${this._ordination.orderBy}`,
      this._ordination.sort,
    );

    const handleInternalError = (e) => {
      if (e instanceof GeneralError) throw e;
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on transaction list',
        detail: e,
      });
    };

    const transactions = hasPagination
      ? await TransactionPagination.create(queryBuilder)
          .paginate(this._transactionPagination)
          .then((paginationResult) => paginationResult)
          .catch(handleInternalError)
      : await queryBuilder
          .getMany()
          .then((transactions) => {
            return transactions ?? [];
          })
          .catch(handleInternalError);

    return formatTransactionsResponse(transactions) as ITransactionResponse[];
  }

  async delete(id: string): Promise<boolean> {
    return await Transaction.update({ id }, { deletedAt: new Date() })
      .then(() => true)
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction delete',
          detail: e,
        });
      });
  }

  validateStatus(
    transaction: Transaction,
    witnesses: IWitnesses[],
  ): TransactionStatus {
    const witness: {
      DONE: number;
      REJECTED: number;
      PENDING: number;
    } = {
      DONE: 0,
      REJECTED: 0,
      PENDING: 0,
    };

    witnesses.map((item: IWitnesses) => {
      witness[item.status]++;
    });

    console.log({
      witness,
      req: transaction.predicate.minSigners,
    });

    const totalSigners =
      witness[WitnessStatus.DONE] +
      witness[WitnessStatus.REJECTED] +
      witness[WitnessStatus.PENDING];

    if (
      transaction.status === TransactionStatus.SUCCESS ||
      transaction.status === TransactionStatus.FAILED ||
      transaction.status === TransactionStatus.PROCESS_ON_CHAIN
    ) {
      return transaction.status;
    }

    if (witness[WitnessStatus.DONE] >= transaction.predicate.minSigners) {
      return TransactionStatus.PENDING_SENDER;
    }

    if (
      totalSigners - witness[WitnessStatus.REJECTED] <
      transaction.predicate.minSigners
    ) {
      return TransactionStatus.DECLINED;
    }

    return TransactionStatus.AWAIT_REQUIREMENTS;
  }

  async instanceTransactionScript(
    tx_data: TransactionRequest,
    vault: Vault,
    witnesses: string[],
  ): Promise<Transfer> {
    return await vault.BakoSafeIncludeTransaction({
      ...tx_data,
      witnesses,
    });
  }

  checkInvalidConditions(status: TransactionStatus) {
    const invalidConditions =
      !status ||
      status === TransactionStatus.AWAIT_REQUIREMENTS ||
      status === TransactionStatus.SUCCESS;

    if (invalidConditions) {
      throw new NotFound({
        type: ErrorTypes.NotFound,
        title: 'Error on transaction list',
        detail: 'No transactions found with the provided params',
      });
    }
  }

  //instance vault
  //instance tx
  //add witnesses
  async sendToChain(bsafe_txid: string) {
    const { predicate, txData, status, resume } =
      await Transaction.createQueryBuilder('t')
        .innerJoin('t.predicate', 'p') //predicate
        .addSelect(['t.id', 't.tx_data', 't.resume', 't.status', 'p.provider'])
        .where('t.id = :id', { id: bsafe_txid })
        .getOne();

    this.checkInvalidConditions(status);
    if (status === TransactionStatus.PROCESS_ON_CHAIN) {
      console.log('[JA_SUBMETIDO] - ', bsafe_txid);
      return;
    }

    const provider = await Provider.create(predicate.provider);
    const tx = transactionRequestify({
      ...txData,
      witnesses: [
        ...(txData.type === FuelTransactionType.Create // is required add on 1st position
          ? [hexlify(txData.witnesses[txData.bytecodeWitnessIndex])]
          : []),
        ...resume.witnesses
          .filter((w) => !!w.signature)
          .map((w) => w.signature),
      ],
    });

    await provider.estimatePredicates(tx);
    const encodedTransaction = hexlify(tx.toTransactionBytes());

    //submit
    return await provider.operations
      .submit({ encodedTransaction })
      .then(async () => {
        await this.update(bsafe_txid, {
          status: TransactionStatus.PROCESS_ON_CHAIN,
        });
      })
      .catch((e) => {
        // const error = BakoError.parse(e);
        this.update(bsafe_txid, {
          status: TransactionStatus.FAILED,
          resume: {
            ...resume,
            status: TransactionStatus.FAILED,
            error: e.toJSON(),
          },
        });
      });
  }

  async verifyOnChain(api_transaction: Transaction, provider: Provider) {
    const idOnChain = `0x${api_transaction.hash}`;
    const sender = new TransactionResponse(idOnChain, provider);
    const {
      status: { type },
    } = await sender.fetch();

    if (type === TransactionProcessStatus.SUBMITED) {
      return api_transaction.resume;
    }
    if (
      type === TransactionProcessStatus.SUCCESS ||
      type === TransactionProcessStatus.FAILED
    ) {
      const { fee } = await sender.waitForResult();
      const gasUsed = fee.format({ precision: 9 });

      const resume = {
        ...api_transaction.resume,
        status:
          type === TransactionProcessStatus.SUCCESS
            ? TransactionStatus.SUCCESS
            : TransactionStatus.FAILED,
      };
      const _api_transaction: IUpdateTransactionPayload = {
        status: resume.status,
        sendTime: new Date(),
        gasUsed,
        resume: {
          ...resume,
          gasUsed,
        },
      };

      await this.update(api_transaction.id, _api_transaction);

      // NOTIFY MEMBERS ON TRANSACTIONS SUCCESS
      const notificationService = new NotificationService();

      const summary = {
        vaultId: api_transaction.predicate.id,
        vaultName: api_transaction.predicate.name,
        transactionId: api_transaction.id,
        transactionName: api_transaction.name,
        workspaceId: api_transaction.predicate.workspace.id,
      };

      if (type === TransactionProcessStatus.SUCCESS) {
        for await (const member of api_transaction.predicate.members) {
          await notificationService.create({
            title: NotificationTitle.TRANSACTION_COMPLETED,
            summary,
            user_id: member.id,
          });

          if (member.notify) {
            await sendMail(EmailTemplateType.TRANSACTION_COMPLETED, {
              to: member.email,
              data: { summary: { ...summary, name: member?.name ?? '' } },
            });
          }
        }
      }
      return resume;
    }

    return api_transaction.resume;
  }

  async fetchFuelTransactions(
    predicates: Predicate[],
  ): Promise<ITransactionResponse[]> {
    try {
      let _transactions: ITransactionResponse[] = [];

      for await (const predicate of predicates) {
        const address = Address.fromString(predicate.predicateAddress).toB256();
        const provider = await Provider.create(predicate.provider);

        // TODO: change this to use pagination and order DESC
        const { transactions } = await getTransactionsSummaries({
          provider,
          filters: {
            owner: address,
            first: 1000,
          },
        });

        // Filter only successful transactions and operations whose receiver is the predicate address
        const filteredTransactions = transactions
          .filter((tx) => tx.isStatusSuccess)
          .filter((tx) =>
            tx.operations.some((op) => op.to?.address === address),
          );

        const formattedTransactions = filteredTransactions.map((tx) =>
          formatFuelTransaction(tx, predicate),
        );

        _transactions = [..._transactions, ...formattedTransactions];
      }

      return _transactions;
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on transaction fetchFuelTransactions',
        detail: e,
      });
    }
  }

  async fetchFuelTransactionById(
    id: string,
    predicate: Predicate,
  ): Promise<ITransactionResponse> {
    try {
      const provider = await Provider.create(predicate.provider);

      const tx = await getTransactionSummary({
        id,
        provider,
      });

      return formatFuelTransaction(tx, predicate);
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on transaction fetchFuelTransactionById',
        detail: e,
      });
    }
  }
}
