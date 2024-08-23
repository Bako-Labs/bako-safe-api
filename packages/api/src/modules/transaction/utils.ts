import { type Predicate, Transaction, TransactionType } from '@src/models';
import { formatAssets } from '@src/utils/formatAssets';
import {
  IDefaultOrdination,
  type IOrdination,
  Sort,
} from '@src/utils/ordination/helper';
import type { IPagination } from '@src/utils/pagination';
import { TransactionStatus } from 'bakosafe';
import { isUUID } from 'class-validator';
import type { TransactionResult } from 'fuels';
import type { IDeposit } from '../predicate/types';
import type { ITransactionPagination } from './pagination';
import type {
  ICreateTransactionPayload,
  ITransactionResponse,
  ITransactionsGroupedByMonth,
  ITransactionsListParams,
} from './types';
import type { ITransactionCounter } from './types';

export const formatTransactionsResponse = (
  transactions: IPagination<Transaction> | Transaction[],
): IPagination<ITransactionResponse> | ITransactionResponse[] => {
  if (Array.isArray(transactions)) {
    return transactions.map(Transaction.formatTransactionResponse);
  }
  return {
    ...transactions,
    data: transactions.data.map(Transaction.formatTransactionResponse),
  };
};

const convertToArray = (groupedData: {
  [key: string]: ITransactionResponse[];
}) => {
  return Object.keys(groupedData).map((monthYear) => ({
    monthYear,
    transactions: groupedData[monthYear],
  }));
};

const groupTransactions = (
  transactions: ITransactionResponse[],
): ITransactionsGroupedByMonth[] => {
  const groupedData = transactions.reduce(
    (acc, transaction) => {
      const options = { year: 'numeric', month: 'long' } as const;
      const monthYear = transaction.createdAt.toLocaleDateString(
        'en-US',
        options,
      );

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    },
    {} as { [key: string]: ITransactionResponse[] },
  );

  const groupedArray = convertToArray(groupedData);

  return groupedArray;
};

export const groupedTransactions = (
  transactions: IPagination<ITransactionResponse> | ITransactionResponse[],
): IPagination<ITransactionsGroupedByMonth> | ITransactionsGroupedByMonth => {
  const isPaginated = !Array.isArray(transactions);
  const transactionArray: ITransactionResponse[] = isPaginated
    ? transactions.data
    : transactions;

  const groupedArray = groupTransactions(transactionArray);

  if (isPaginated) {
    return {
      currentPage: transactions.currentPage,
      totalPages: transactions.totalPages,
      nextPage: transactions.nextPage,
      prevPage: transactions.prevPage,
      perPage: transactions.perPage,
      total: transactions.total,
      data: groupedArray,
    };
  }

  // Caso a resposta não seja uma paginação, retornar com mesmo formato de uma.
  return {
    currentPage: 1,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
    perPage: transactionArray.length,
    total: transactionArray.length,
    data: groupedArray,
  };
};

export const groupedMergedTransactions = (
  transactions:
    | ITransactionPagination<ITransactionResponse>
    | ITransactionResponse[],
):
  | ITransactionPagination<ITransactionsGroupedByMonth>
  | ITransactionsGroupedByMonth => {
  const isPaginated = !Array.isArray(transactions);
  const transactionArray: ITransactionResponse[] = isPaginated
    ? transactions.data
    : transactions;

  const groupedArray = groupTransactions(transactionArray);

  if (isPaginated) {
    return {
      ...transactions,
      data: groupedArray,
    };
  }

  // Caso a resposta não seja uma paginação, retornar com mesmo formato de uma.
  return {
    perPage: transactionArray.length,
    offsetDb: 0,
    offsetFuel: 0,
    data: groupedArray,
  };
};

export const formatPayloadToCreateTransaction = (
  deposit: IDeposit,
  predicate: Predicate,
  address: string,
): ICreateTransactionPayload => {
  const formattedAssets = deposit.operations.flatMap((operation) =>
    operation.assetsSent.map((asset) => ({
      to: operation.from.address,
      assetId: asset.assetId,
      //@ts-ignore
      amount: asset.amount.format(),
    })),
  );

  const payload = {
    txData: deposit.txData,
    type: TransactionType.DEPOSIT,
    name: `DEPOSIT_${deposit.id}`,
    hash: deposit.id.slice(2),
    sendTime: deposit.date,
    gasUsed: deposit.gasUsed,
    predicateId: predicate.id,
    predicateAddress: address,
    status: TransactionStatus.SUCCESS,
    resume: {
      hash: deposit.id,
      status: TransactionStatus.SUCCESS,
      witnesses: [],
      requiredSigners: predicate.minSigners,
      totalSigners: predicate.members.length,
      predicate: {
        id: predicate.id,
        address: predicate.predicateAddress,
      },
      id: '',
    },
    assets: formattedAssets,
    predicate,
    createdBy: predicate.owner,
    summary: null,
  };

  return payload;
};

export const formatFuelTransaction = (
  tx: TransactionResult,
  predicate: Predicate,
): ITransactionResponse => {
  const {
    gasPrice,
    scriptGasLimit,
    script,
    scriptData,
    type,
    witnesses,
    outputs,
    inputs,
  } = tx.transaction;

  const formattedTransaction = {
    id: tx.id,
    name: `DEPOSIT_${tx.id}`, // TODO: change this
    hash: tx.id.slice(2),
    sendTime: tx.date,
    createdAt: tx.date,
    updatedAt: tx.date,
    type: TransactionType.DEPOSIT,
    txData: {
      gasPrice,
      scriptGasLimit,
      script,
      scriptData,
      type,
      witnesses,
      outputs,
      inputs,
    },
    status: TransactionStatus.SUCCESS,
    summary: null,
    gasUsed: tx.gasUsed.format(),
    resume: {
      hash: tx.id,
      status: TransactionStatus.SUCCESS,
      witnesses: [],
      requiredSigners: predicate.minSigners,
      totalSigners: predicate.members.length,
      predicate: {
        id: predicate.id,
        address: predicate.predicateAddress,
      },
      id: tx.id,
    },
    createdBy: predicate.owner,
    predicateId: predicate.id,
    predicate: {
      id: predicate.id,
      name: predicate.name,
      minSigners: predicate.minSigners,
      predicateAddress: predicate.predicateAddress,
      members: predicate.members,
      workspace: {
        id: predicate.workspace.id,
        name: predicate.workspace.name,
        single: predicate.workspace.single,
      },
    },
    assets: formatAssets(outputs, predicate.predicateAddress),
  };

  return formattedTransaction as unknown as ITransactionResponse;
};

export const mergeTransactionLists = (
  dbList:
    | IPagination<ITransactionResponse>
    | ITransactionPagination<ITransactionResponse>
    | ITransactionResponse[],
  fuelList: ITransactionResponse[],
  params: ITransactionsListParams,
): ITransactionPagination<ITransactionResponse> | ITransactionResponse[] => {
  const {
    ordination: { orderBy, sort },
    perPage,
    offsetDb,
    offsetFuel,
  } = params;

  const _ordination = {
    orderBy: orderBy || IDefaultOrdination.UPDATED_AT,
    sort: sort || Sort.DESC,
  };
  const _perPage = perPage ? Number(perPage) : undefined;
  const _offsetDb = offsetDb ? Number(offsetDb) : undefined;
  const _offsetFuel = offsetFuel ? Number(offsetFuel) : undefined;
  const isPaginated = perPage && offsetDb && offsetFuel;

  const dbListArray: ITransactionResponse[] = Array.isArray(dbList)
    ? dbList
    : dbList.data;

  // Filter out deposits that are already in the database
  const filteredFuelList = fuelList.filter(
    (tx) =>
      !dbListArray.some(
        (dbTx) =>
          dbTx.hash === tx.hash && dbTx.type === TransactionType.DEPOSIT,
      ),
  );

  const sortedFuelList = sortTransactions(filteredFuelList, _ordination);

  // Keeps the number of transactions according to perPage if paginated
  const _fuelList = isPaginated
    ? sortedFuelList.slice(_offsetFuel, _offsetFuel + _perPage)
    : sortedFuelList;

  const mergedList = sortTransactions(
    [...dbListArray, ..._fuelList],
    _ordination,
  );
  const list = isPaginated ? mergedList.slice(0, _perPage) : mergedList;

  if (!isPaginated) {
    return list;
  }

  const counter = countTransactionsPerOrigin(list);
  const newOffsetDb = _offsetDb + counter.DB;
  const newOffsetFuel = _offsetFuel + counter.FUEL;

  return {
    data: list,
    perPage: _perPage,
    offsetDb: newOffsetDb,
    offsetFuel: newOffsetFuel,
  };
};

export const sortTransactions = (
  transactions: ITransactionResponse[],
  ordination: IOrdination<Transaction>,
): ITransactionResponse[] => {
  const { orderBy, sort } = ordination;
  const sortedTransactions = transactions.sort((a, b) => {
    let compareValue = 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];

    switch (orderBy) {
      case 'createdAt':
      case 'updatedAt':
      case 'sendTime':
        compareValue =
          new Date(aValue as string).getTime() -
          new Date(bValue as string).getTime();
        break;
      default:
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          compareValue = aValue.localeCompare(bValue);
        } else {
          compareValue = 0;
        }
        break;
    }

    return sort === 'ASC' ? compareValue : -compareValue;
  });

  return sortedTransactions;
};

const countTransactionsPerOrigin = (
  transactions: ITransactionResponse[],
): ITransactionCounter => {
  return transactions.reduce<ITransactionCounter>(
    (counter, transaction) => {
      if (isUUID(transaction.id)) {
        counter.DB++;
      } else {
        counter.FUEL++;
      }
      return counter;
    },
    { DB: 0, FUEL: 0 },
  );
};
