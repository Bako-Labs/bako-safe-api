import crypto from 'node:crypto';
import { BakoSafe, type IConfVault, Vault } from 'bakosafe';
import { Provider } from 'fuels';

import type { IPredicatePayload } from '@src/modules/predicate/types';

export class PredicateMock {
  public BSAFEVaultconfigurable: IConfVault;
  public predicatePayload: Omit<IPredicatePayload, 'user'>;
  public vault: Vault;

  protected constructor(
    BSAFEVaultConfigurable: IConfVault,
    predicatePayload: Omit<IPredicatePayload, 'user'>,
    vault: Vault,
  ) {
    this.BSAFEVaultconfigurable = BSAFEVaultConfigurable;
    this.predicatePayload = predicatePayload;
    this.vault = vault;
  }

  public static async create(
    min: number,
    SIGNERS: string[],
  ): Promise<PredicateMock> {
    const provider = await Provider.create(BakoSafe.getProviders('CHAIN_URL'));
    const _BSAFEVaultconfigurable = {
      SIGNATURES_COUNT: min,
      SIGNERS,
      network: BakoSafe.getProviders('CHAIN_URL'),
      chainId: provider.getChainId(),
    };

    const vault = await Vault.create({
      configurable: _BSAFEVaultconfigurable,
    });

    const predicatePayload = {
      name: crypto.randomUUID(),
      description: crypto.randomUUID(),
      provider: vault.provider.url,
      chainId: vault.provider.getChainId(),
      predicateAddress: vault.address.toString(),
      minSigners: min,
      configurable: JSON.stringify({ ...vault.getConfigurable() }),
      addresses: _BSAFEVaultconfigurable.SIGNERS.map((signer) => signer),
    };

    return new PredicateMock(_BSAFEVaultconfigurable, predicatePayload, vault);
  }
}
