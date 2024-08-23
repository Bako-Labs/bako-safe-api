import {
  type Transaction,
  TransactionCoder,
  type TransactionType,
  arrayify,
} from 'fuels';

export const toTransaction = (txHex: string) => {
  const transactionCoder = new TransactionCoder();
  const [txDecoded] = transactionCoder.decode(arrayify(txHex), 0);

  return txDecoded as Transaction<TransactionType.Create>;
};
