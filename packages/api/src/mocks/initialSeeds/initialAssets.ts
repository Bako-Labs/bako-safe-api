import { bn } from 'fuels';

import type { ITransferAsset } from 'bakosafe';
import { accounts } from '../accounts';

export const ETH_id =
  '0x000000000000000000000000000000000000000000000000000000';

export const generateInitialAssets = async (): Promise<ITransferAsset[]> => {
  const asset1: ITransferAsset = {
    assetId: ETH_id,
    amount: bn(1000).toString(),
    to: accounts.STORE.address,
  };

  const asset2: ITransferAsset = {
    assetId: ETH_id,
    amount: bn(100000).toString(),
    to: accounts.STORE.address,
  };

  return [asset1, asset2];
};
