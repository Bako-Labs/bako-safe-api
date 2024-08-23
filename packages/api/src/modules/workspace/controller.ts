import { BakoSafe, TransactionStatus } from 'bakosafe';

import { PermissionAccess, Predicate, TypeUser, type User } from '@src/models';
import { PermissionRoles, type Workspace } from '@src/models/Workspace';
import Internal from '@src/utils/error/Internal';
import {
  Unauthorized,
  UnauthorizedErrorTitles,
} from '@src/utils/error/Unauthorized';
import { IconUtils } from '@src/utils/icons';

import { ErrorTypes, error } from '@utils/error';
import {
  Responses,
  assetsMapBySymbol,
  calculateBalanceUSD,
  calculateReservedCoins,
  subCoins,
  successful,
} from '@utils/index';

import { type CoinQuantity, bn } from 'fuels';
import { PredicateService } from '../predicate/services';
import { UserService } from '../user/service';
import { WorkspaceService } from './services';
import type {
  ICreateRequest,
  IGetBalanceRequest,
  IListByUserRequest,
  IUpdateMembersRequest,
  IUpdatePermissionsRequest,
  IUpdateRequest,
} from './types';

export class WorkspaceController {
  async listByUser(req: IListByUserRequest) {
    try {
      const { user } = req;

      const response = await new WorkspaceService().findByUser(user.id);

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async create(req: ICreateRequest) {
    try {
      const { user } = req;
      const { members = [] } = req.body;

      const { _members, _permissions } =
        await new WorkspaceService().includeMembers(members, req.user);

      const response = await new WorkspaceService().create({
        ...req.body,
        owner: user,
        members: _members,
        permissions: _permissions,
        single: false,
        avatar: IconUtils.workspace(),
      });

      return successful(response, Responses.Created);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async fetchPredicateData(req: IGetBalanceRequest) {
    let reservedCoins: CoinQuantity[] = [];
    let predicateCoins: CoinQuantity[] = [];
    try {
      const { workspace } = req;
      const predicateService = new PredicateService();

      const predicates = await Predicate.createQueryBuilder('p')
        .leftJoin('p.workspace', 'w')
        .leftJoin('p.version', 'pv')
        .leftJoin('p.transactions', 't', 't.status IN (:...status)', {
          status: [
            TransactionStatus.AWAIT_REQUIREMENTS,
            TransactionStatus.PENDING_SENDER,
          ],
        })
        .addSelect([
          'p.id',
          'p.configurable',
          'pv.code',
          'w.id',
          't.status',
          't.txData',
        ])
        .where('w.id = :id', { id: workspace.id })
        .getMany();

      // Fetches the balance of each predicate
      const balancePromises = predicates.map(
        async ({
          configurable,
          version: { code: versionCode },
          transactions,
        }) => {
          const vault = await predicateService.instancePredicate(
            configurable,
            versionCode,
          );
          const balances = (await vault.getBalances()).balances;

          predicateCoins = balances.reduce((accumulator, balance) => {
            const assetId = balance.assetId;
            const existingAsset = accumulator.find(
              (item) => item.assetId === assetId,
            );

            if (existingAsset) {
              existingAsset.amount = existingAsset.amount.add(balance.amount);
            } else {
              accumulator.push({
                assetId,
                amount: balance.amount,
              });
            }

            return accumulator;
          }, predicateCoins);

          reservedCoins = calculateReservedCoins(transactions);

          return balances;
        },
      );

      await Promise.all(balancePromises);

      // Subtracts the amount of coins reserved per asset from the balance per asset
      const assets =
        reservedCoins.length > 0
          ? subCoins(predicateCoins, reservedCoins)
          : predicateCoins;

      return successful(
        {
          //no necessary items here (on workspace)
          // reservedCoinsUSD: calculateBalanceUSD(reservedCoins),
          // totalBalanceUSD: calculateBalanceUSD(predicateCoins),
          currentBalanceUSD: calculateBalanceUSD(assets),
          currentBalance: assets,
          // totalBalance: predicateCoins,
          // reservedCoins,
        },
        Responses.Ok,
      );
    } catch (_error) {
      reservedCoins = [
        {
          assetId: assetsMapBySymbol.ETH.id,
          amount: bn.parseUnits('0'),
        },
      ] as CoinQuantity[];
    }
  }

  // todo: implement this by other coins, and use utils of bsafe-sdk
  // async getBalance(req: IGetBalanceRequest) {
  //   try {
  //     const { workspace } = req;
  //     const predicateService = new PredicateService();
  //     const transactionService = new TransactionService();
  //     const predicatesBalance = [];
  //     let reservedCoins: CoinQuantity[] = [];

  //     await predicateService
  //       .filter({
  //         workspace: [workspace.id],
  //       })
  //       .list()
  //       .then(async (response: Predicate[]) => {
  //         for await (const predicate of response) {
  //           const vault = await predicateService.instancePredicate(predicate.id);
  //           // predicatesBalance.push(...(await vault.getBalances()).balances());
  //           predicatesBalance.push(...(await vault.getBalances()));
  //         }

  //         // Calculates amount of coins reserved per asset
  //         const predicateIds = response.map(item => item.id);
  //         reservedCoins = await transactionService
  //           .filter({
  //             predicateId: predicateIds,
  //           })
  //           .list()
  //           .then((data: Transaction[]) => {
  //             return data
  //               .filter(
  //                 (transaction: Transaction) =>
  //                   transaction.status === TransactionStatus.AWAIT_REQUIREMENTS ||
  //                   transaction.status === TransactionStatus.PENDING_SENDER,
  //               )
  //               .reduce((accumulator, transaction: Transaction) => {
  //                 transaction.assets.forEach((asset: AssetModel) => {
  //                   const assetId = asset.assetId;
  //                   const amount = bn.parseUnits(asset.amount);
  //                   const existingAsset = accumulator.find(
  //                     item => item.assetId === assetId,
  //                   );

  //                   if (existingAsset) {
  //                     existingAsset.amount = existingAsset.amount.add(amount);
  //                   } else {
  //                     accumulator.push({ assetId, amount });
  //                   }
  //                 });
  //                 return accumulator;
  //               }, [] as CoinQuantity[]);
  //           })
  //           .catch(() => {
  //             return [
  //               {
  //                 assetId: assetsMapBySymbol['ETH'].id,
  //                 amount: bn.parseUnits('0'),
  //               },
  //             ] as CoinQuantity[];
  //           });
  //       });

  //     // Calculate balance per asset
  //     const formattedPredicatesBalance = predicatesBalance.map(item => ({
  //       ...item,
  //       amount: item.amount.format(),
  //     }));
  //     const assetsBalance = await Asset.assetsGroupById(formattedPredicatesBalance);
  //     const formattedAssetsBalance = Object.entries(assetsBalance).map(
  //       ([assetId, amount]) => ({
  //         assetId,
  //         amount,
  //       }),
  //     );

  //     // Subtracts the amount of coins reserved per asset from the balance per asset
  //     const availableAssetsBalance =
  //       reservedCoins.length > 0
  //         ? subCoins(formattedAssetsBalance, reservedCoins)
  //         : formattedAssetsBalance;

  //     return successful(
  //       {
  //         balanceUSD: calculateBalanceUSD(availableAssetsBalance),
  //         workspaceId: workspace.id,
  //         assetsBalance: availableAssetsBalance,
  //       },
  //       Responses.Ok,
  //     );
  //   } catch (e) {
  //     return error(e.error, e.statusCode);
  //   }
  // }

  async findById(req: IListByUserRequest) {
    try {
      const { id } = req.params;

      const response = await new WorkspaceService().findById(id);
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async update(req: IUpdateRequest) {
    try {
      const {
        workspace: { id },
      } = req;

      const response = await new WorkspaceService()
        .update({
          ...req.body,
          id,
        })
        .then(async () => {
          return await new WorkspaceService().findById(id);
        });
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async updatePermissions(req: IUpdatePermissionsRequest) {
    try {
      const { member } = req.params;
      const { permissions } = req.body;
      const {
        workspace: { id },
      } = req;

      const response = await new WorkspaceService()
        .filter({ id })
        .list()
        .then(async (data: Workspace[]) => {
          if (!data) {
            throw new Internal({
              type: ErrorTypes.NotFound,
              title: 'Workspace not found',
              detail: `Workspace ${id} not found`,
            });
          }
          const workspace = data[0];
          if (workspace.owner.id === member) {
            throw new Unauthorized({
              type: ErrorTypes.Unauthorized,
              title: UnauthorizedErrorTitles.MISSING_PERMISSION,
              detail: 'Owner cannot change his own permissions',
            });
          }

          const memberPermission = workspace.permissions[member];
          const signerPermission = memberPermission?.[PermissionRoles.SIGNER];

          // update user permissions expect signer object
          workspace.permissions = {
            ...workspace.permissions,
            [member]: {
              ...permissions,
              [PermissionRoles.SIGNER]: signerPermission ?? [
                PermissionAccess.NONE,
              ],
            },
          };

          return await workspace.save();
        });

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async addMember(req: IUpdateMembersRequest) {
    try {
      const { member } = req.params;
      const {
        workspace: { id },
      } = req;

      const workspace = await new WorkspaceService()
        .filter({ id })
        .list()
        .then((data) => {
          if (!data) {
            throw new Internal({
              type: ErrorTypes.NotFound,
              title: 'Workspace not found',
              detail: `Workspace ${id} not found`,
            });
          }
          return data[0];
        })
        .catch((e) => {
          throw e;
        });

      const _member =
        member.length <= 36
          ? await new UserService().findOne(member)
          : await new UserService()
              .findByAddress(member)
              .then(async (data: User) => {
                if (!data) {
                  return await new UserService().create({
                    address: member,
                    name: member,
                    provider: BakoSafe.getProviders('CHAIN_URL'),
                    avatar: IconUtils.user(),
                    type: TypeUser.FUEL,
                  });
                }
                return data;
              });

      if (!workspace.members.find((m) => m.id === _member.id)) {
        workspace.members = [...workspace.members, _member];
      }

      return successful(await workspace.save(), Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async removeMember(req: IUpdateMembersRequest) {
    try {
      const { member } = req.params;
      const {
        workspace: { id },
      } = req;

      const workspace = await new WorkspaceService()
        .filter({ id })
        .list()
        .then((data) => {
          if (!data) {
            throw new Internal({
              type: ErrorTypes.NotFound,
              title: 'Workspace not found',
              detail: `Workspace ${id} not found`,
            });
          }
          if (data[0].owner.id === member) {
            throw new Unauthorized({
              type: ErrorTypes.Unauthorized,
              title: UnauthorizedErrorTitles.MISSING_PERMISSION,
              detail: 'Owner cannot be removed from workspace',
            });
          }
          return data[0];
        });

      workspace.members = workspace.members.filter((m) => m.id !== member);
      delete workspace.permissions[member];

      return successful(await workspace.save(), Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
