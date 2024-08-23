import { type OutputCoin, type TransactionRequestOutput, bn } from 'fuels';
import { isOutputCoin } from './outputTypeValidate';

const formatAssets = (outputs: TransactionRequestOutput[], to?: string) => {
  const assets = outputs
    .filter((output: TransactionRequestOutput) => isOutputCoin(output))
    .filter((output: OutputCoin) => (to ? output.to === to : true))
    .map((output: OutputCoin) => {
      const { assetId, amount, to } = output;
      return {
        assetId,
        amount: bn(amount).format(),
        to,
      };
    });

  return assets;
};

export { formatAssets };
