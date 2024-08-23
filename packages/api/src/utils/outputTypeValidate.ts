import { OutputType, type TransactionRequestOutput } from 'fuels';

const isOutputCoin = (output: TransactionRequestOutput): boolean =>
  output.type === OutputType.Coin;

export { isOutputCoin };
