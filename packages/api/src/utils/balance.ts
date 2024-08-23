import {
  BN,
  type CoinQuantity,
  type OutputCoin,
  type TransactionRequestOutput,
  bn,
} from 'fuels';

import type { Transaction } from '@src/models';
import app from '@src/server/app';
import { isOutputCoin } from './outputTypeValidate';

const calculateReservedCoins = (
  transactions: Transaction[],
): CoinQuantity[] => {
  const reservedMap = new Map<string, BN>();

  transactions.forEach((transaction) => {
    const { outputs } = transaction.txData;

    outputs
      .filter((output: TransactionRequestOutput) => isOutputCoin(output))
      .forEach((output: OutputCoin) => {
        const { assetId, amount } = output;
        const currentAmount = reservedMap.get(assetId) || new BN(0);
        reservedMap.set(assetId, currentAmount.add(amount));
      });
  });

  const result = Array.from(reservedMap, ([assetId, amount]) => ({
    assetId,
    amount,
  }));

  return result;
};

const calculateBalanceUSD = (balances: CoinQuantity[]): string => {
  let balanceUSD = 0;

  balances?.forEach((balance) => {
    const formattedAmount = Number.parseFloat(balance.amount.format());
    const priceUSD = app._quoteCache.getQuote(balance.assetId);
    balanceUSD += formattedAmount * priceUSD;
  });

  return balanceUSD.toFixed(2);
};

const subCoins = (
  balances: CoinQuantity[],
  reservedCoins: CoinQuantity[],
): CoinQuantity[] => {
  const reservedMap = new Map(
    reservedCoins.map((coin) => [coin.assetId, coin.amount]),
  );

  return balances
    .map((balance) => {
      const reservedAmount = reservedMap.get(balance.assetId);
      const adjustedAmount = reservedAmount
        ? balance.amount.sub(reservedAmount)
        : balance.amount;
      return { ...balance, amount: adjustedAmount };
    })
    .filter((balance) => balance.amount.gt(bn.parseUnits('0')));
};

export { calculateReservedCoins, calculateBalanceUSD, subCoins };
