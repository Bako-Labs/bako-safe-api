import { BakoSafe, type Vault } from 'bakosafe';
import { type BN, Provider, Wallet } from 'fuels';

export const txParams = {
  maxFee: BakoSafe.getGasConfig('MAX_FEE'),
  gasLimit: BakoSafe.getGasConfig('GAS_LIMIT'),
};

export const sendPredicateCoins = async (
  predicate: Vault,
  amount: BN,
  asset: string,
  rootWallet: string,
) => {
  const wallet = Wallet.fromPrivateKey(
    rootWallet,
    await Provider.create(BakoSafe.getProviders('CHAIN_URL')),
  );
  const deposit = await wallet.transfer(
    predicate.address,
    amount,
    asset,
    txParams,
  );
  await deposit.wait();
};

export const signBypK = async (message: string, privateKey: string) => {
  const provider = await Provider.create(BakoSafe.getProviders('CHAIN_URL'));
  const signer = Wallet.fromPrivateKey(privateKey, provider);
  return signer.signMessage(message);
};
