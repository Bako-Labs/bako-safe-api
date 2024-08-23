import { type ITransferAsset, TransactionStatus } from 'bakosafe';

import { Predicate, type Transaction, User } from '@src/models';

import { accounts } from '../accounts';
import { txData } from '../txdata';
import { generateInitialAssets } from './initialAssets';

export interface TTI
  extends Partial<Omit<Transaction, 'assets' | 'witnesses'>> {
  assets: ITransferAsset[];
}
export const generateInitialTransaction = async (): Promise<TTI> => {
  const user = await User.findOne({
    where: {
      address: accounts.USER_1.address,
    },
  });

  const predicate = await Predicate.find({
    order: {
      createdAt: 'DESC',
    },
    take: 1,
  });

  const assets = await generateInitialAssets();

  const transaction1: TTI = {
    name: `fake_name ${accounts.USER_1.address} ${TransactionStatus.AWAIT_REQUIREMENTS}`,
    hash: 'fake_hash',
    txData: JSON.parse(txData),
    status: TransactionStatus.AWAIT_REQUIREMENTS,
    sendTime: new Date(),
    gasUsed: 'fake_gasUsed',
    resume: {
      status: TransactionStatus.AWAIT_REQUIREMENTS,
      predicate: {
        id: predicate[0].id,
        address: predicate[0].predicateAddress,
      },
      totalSigners: 0,
      requiredSigners: 0,
      hash: 'fake_hash',
      id: 'fake_id',
      witnesses: [],
    },
    createdBy: user,
    predicate: predicate[0],
    assets,
    //witnesses,
  };

  return transaction1;
};
