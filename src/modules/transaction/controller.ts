import { TransactionStatus } from 'bsafe';
import { Provider } from 'fuels';

import AddressBook from '@src/models/AddressBook';
import { IPagination } from '@src/utils/pagination';

import {
  NotificationTitle,
  Predicate,
  Transaction,
  WitnessesStatus,
} from '@models/index';

import { IPredicateService } from '@modules/predicate/types';
import { IWitnessService } from '@modules/witness/types';

import { error } from '@utils/error';
import { Responses, bindMethods, successful } from '@utils/index';

import { IAddressBookService } from '../addressBook/types';
import { IAssetService } from '../asset/types';
import { INotificationService } from '../notification/types';
import {
  ICloseTransactionRequest,
  ICreateTransactionRequest,
  IFindTransactionByHashRequest,
  IFindTransactionByIdRequest,
  IListRequest,
  ISendTransactionRequest,
  ISignByIdRequest,
  ITransactionService,
  IUpdateTransactionPayload,
} from './types';

export class TransactionController {
  private transactionService: ITransactionService;
  private predicateService: IPredicateService;
  private witnessService: IWitnessService;
  private addressBookService: IAddressBookService;
  private notificationService: INotificationService;

  constructor(
    transactionService: ITransactionService,
    predicateService: IPredicateService,
    witnessService: IWitnessService,
    addressBookService: IAddressBookService,
    assetService: IAssetService,
    notificationService: INotificationService,
  ) {
    Object.assign(this, {
      transactionService,
      predicateService,
      witnessService,
      addressBookService,
      assetService,
      notificationService,
    });
    bindMethods(this);
  }

  async create({ body: transaction, user }: ICreateTransactionRequest) {
    const { predicateAddress, summary } = transaction;

    try {
      const predicate = await this.predicateService
        .filter({
          address: predicateAddress,
        })
        .paginate(undefined)
        .list()
        .then((result: Predicate[]) => result[0]);

      const witnesses = predicate.members.map(member => ({
        account: member.address,
        status: WitnessesStatus.PENDING,
        signature: null,
      }));

      const newTransaction = await this.transactionService.create({
        ...transaction,
        status: TransactionStatus.AWAIT_REQUIREMENTS,
        resume: {
          hash: transaction.hash,
          status: TransactionStatus.AWAIT_REQUIREMENTS,
          witnesses: witnesses.filter(w => !!w.signature).map(w => w.signature),
          outputs: transaction.assets.map(({ amount, to, assetId }) => ({
            amount,
            to,
            assetId,
          })),
          requiredSigners: predicate.minSigners,
          totalSigners: predicate.members.length,
          predicate: {
            id: predicate.id,
            address: predicate.predicateAddress,
          },
        },
        witnesses,
        predicate,
        createdBy: user,
        summary,
      });

      const { id, name } = newTransaction;
      const membersWithoutLoggedUser = predicate.members.filter(
        member => member.id !== user.id,
      );

      for await (const member of membersWithoutLoggedUser) {
        await this.notificationService.create({
          title: NotificationTitle.TRANSACTION_CREATED,
          summary: {
            vaultId: predicate.id,
            vaultName: predicate.name,
            transactionName: name,
            transactionId: id,
          },
          user_id: member.id,
        });
      }

      return successful(newTransaction, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async findById({ params: { id } }: IFindTransactionByIdRequest) {
    try {
      const response = await this.transactionService.findById(id);
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async findByHash({ params: { hash } }: IFindTransactionByHashRequest) {
    try {
      const response = await this.transactionService
        .filter({ hash })
        .paginate(undefined)
        .list()
        .then((result: Transaction[]) => {
          return result[0];
        });
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async signByID({
    body: { account, signer, confirm },
    params: { id },
    user,
  }: ISignByIdRequest) {
    try {
      const transaction = await this.transactionService.findById(id);

      const { witnesses, resume, predicate, name, id: transactionId } = transaction;
      const _resume = resume;

      const witness = witnesses.find(w => w.account === account);

      if (witness) {
        await this.witnessService.update(witness.id, {
          signature: signer,
          status: confirm ? WitnessesStatus.DONE : WitnessesStatus.REJECTED,
        }),
          _resume.witnesses.push(signer);

        const statusField = await this.transactionService.validateStatus(id);

        await this.transactionService.update(id, {
          status: statusField,
          resume: {
            ..._resume,
            status: statusField,
          },
        });

        const notificationSummary = {
          vaultId: predicate.id,
          vaultName: predicate.name,
          transactionId: transactionId,
          transactionName: name,
        };

        // NOTIFY MEMBERS ON SIGNED TRANSACTIONS
        if (confirm) {
          const membersWithoutLoggedUser = predicate.members.filter(
            member => member.id !== user.id,
          );

          for await (const member of membersWithoutLoggedUser) {
            await this.notificationService.create({
              title: NotificationTitle.TRANSACTION_SIGNED,
              summary: notificationSummary,
              user_id: member.id,
            });
          }
        }

        // NOTIFY MEMBERS ON FAILED TRANSACTIONS
        if (statusField === TransactionStatus.FAILED) {
          for await (const member of predicate.members) {
            await this.notificationService.create({
              title: NotificationTitle.TRANSACTION_DECLINED,
              summary: notificationSummary,
              user_id: member.id,
            });
          }
        }
      }

      return successful(!!witness, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async list(req: IListRequest) {
    const {
      predicateId,
      to,
      status,
      orderBy,
      sort,
      page,
      perPage,
      limit,
      endDate,
      startDate,
      createdBy,
      name,
      allOfUser,
      id,
    } = req.query;
    const { user } = req;

    const _predicateId =
      typeof predicateId == 'string' ? [predicateId] : predicateId;
    const hasPagination = !!page && !!perPage;

    try {
      const predicateIds: string[] = allOfUser
        ? await this.predicateService
            .filter({ signer: user.address })
            .paginate(undefined)
            .list()
            .then((data: Predicate[]) => {
              return data.map(predicate => predicate.id);
            })
        : predicateId
        ? _predicateId
        : undefined;

      if (predicateIds && predicateIds.length === 0)
        return successful([], Responses.Ok);

      let response = await this.transactionService
        .filter({
          predicateId: predicateIds,
          to,
          status,
          endDate,
          startDate,
          createdBy,
          name,
          limit,
          id,
        })
        .ordination({ orderBy, sort })
        .paginate({ page, perPage })
        .list();

      let data = hasPagination
        ? (response as IPagination<Transaction>).data
        : (response as Transaction[]);

      const assets = data.map(i => i.assets);
      const recipientAddresses = assets.flat().map(i => i.to);
      const favorites = (await this.addressBookService
        .filter({ createdBy: user.id, contactAddresses: recipientAddresses })
        .list()) as AddressBook[];

      if (favorites.length > 0) {
        data = (data.map(transaction => ({
          ...transaction,
          assets: transaction.assets.map(asset => ({
            ...asset,
            recipientNickname:
              favorites?.find(favorite => favorite.user.address === asset.to)
                ?.nickname ?? undefined,
          })),
        })) as unknown) as Transaction[];
      }

      response = hasPagination ? { ...response, data } : data;

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async close({
    body: { gasUsed, transactionResult, hasError },
    params: { id },
  }: ICloseTransactionRequest) {
    try {
      const response = await this.transactionService.update(id, {
        status: TransactionStatus.SUCCESS,
        sendTime: new Date(),
        gasUsed,
        resume: transactionResult,
      });
      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async send({ params: { id } }: ISendTransactionRequest) {
    try {
      const api_transaction = await this.transactionService.findById(id);
      const { predicate, txData, witnesses } = api_transaction;
      const _witnesses = witnesses
        .filter(w => !!w)
        .map(witness => witness.signature);
      txData.witnesses = witnesses
        .filter(w => w.status === WitnessesStatus.DONE)
        .map(witness => witness.signature);

      this.transactionService.checkInvalidConditions(api_transaction);

      const tx_id = await this.transactionService.sendToChain(
        txData,
        await Provider.create(predicate.provider),
      );
      const resume = {
        ...api_transaction.resume,
        witnesses: _witnesses,
        bsafeID: api_transaction.id,
      };
      const _api_transaction: IUpdateTransactionPayload = {
        status: TransactionStatus.PROCESS_ON_CHAIN,
        sendTime: new Date(),
        resume: resume,
        hash: tx_id.substring(2),
      };

      await this.transactionService.update(api_transaction.id, _api_transaction);
      return successful(resume, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async verifyOnChain({ params: { id } }: ISendTransactionRequest) {
    try {
      const api_transaction = await this.transactionService.findById(id);
      const { predicate, name, id: transactionId } = api_transaction;
      const provider = await Provider.create(predicate.provider);

      this.transactionService.checkInvalidConditions(api_transaction);

      const result = await this.transactionService.verifyOnChain(
        api_transaction,
        provider,
      );

      // NOTIFY MEMBERS ON TRANSACTIONS SUCCESS
      if (result.status === TransactionStatus.SUCCESS) {
        for await (const member of predicate.members) {
          await this.notificationService.create({
            title: NotificationTitle.TRANSACTION_COMPLETED,
            summary: {
              vaultId: predicate.id,
              vaultName: predicate.name,
              transactionId: transactionId,
              transactionName: name,
            },
            user_id: member.id,
          });
        }
      }

      return successful(result, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
