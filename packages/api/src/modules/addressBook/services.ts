import { Brackets } from 'typeorm';

import AddressBook from '@src/models/AddressBook';
import { NotFound } from '@src/utils/error';

import GeneralError, { ErrorTypes } from '@utils/error/GeneralError';
import Internal from '@utils/error/Internal';
import { type IOrdination, setOrdination } from '@utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@utils/pagination';

import type {
  IAddressBookService,
  ICreateAddressBookPayload,
  IFilterAddressBookParams,
  IUpdateAddressBookPayload,
} from './types';

export class AddressBookService implements IAddressBookService {
  private _ordination: IOrdination<AddressBook>;
  private _pagination: PaginationParams;
  private _filter: IFilterAddressBookParams;
  filter(filter: IFilterAddressBookParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<AddressBook>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async create(payload: ICreateAddressBookPayload): Promise<AddressBook> {
    return await AddressBook.create(payload)
      .save()
      .then((contact) => contact)
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on contact creation',
          detail: e,
        });
      });
  }

  async list(): Promise<IPagination<AddressBook> | AddressBook[]> {
    const hasPagination = this._pagination?.page && this._pagination?.perPage;
    const _hasOrdination = this._ordination?.orderBy && this._ordination?.sort;
    const queryBuilder = AddressBook.createQueryBuilder('ab')
      .select(['ab.id', 'ab.nickname'])
      .innerJoin('ab.user', 'user')
      .innerJoin('ab.owner', 'owner')
      .addSelect([
        'user.id',
        'user.address',
        'user.avatar',
        'user.address',
        'owner.id',
      ]);

    const handleInternalError = (e) => {
      if (e instanceof GeneralError) throw e;

      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on book contact list',
        detail: e,
      });
    };

    this._filter.owner &&
      queryBuilder.andWhere('ab.owner IN (:...owner)', {
        owner: this._filter.owner,
      });

    this._filter.contactAddress &&
      queryBuilder.andWhere('user.address = :contactAddress', {
        contactAddress: `${this._filter.contactAddress}`,
      });

    this._filter.nickname &&
      queryBuilder.andWhere('ab.nickname = :nickname', {
        nickname: `${this._filter.nickname}`,
      });

    this._filter.userIds?.length &&
      queryBuilder.andWhere('ab.user_id IN (:...userIds)', {
        userIds: this._filter.userIds,
      });

    this._filter.contactAddresses?.length &&
      queryBuilder.andWhere('user.address IN (:...contactAddresses)', {
        contactAddresses: this._filter.contactAddresses,
      });

    this._filter.q &&
      queryBuilder.andWhere(
        new Brackets((qb) =>
          qb
            .where('LOWER(ab.nickname) LIKE LOWER(:nickname)', {
              nickname: `%${this._filter.q}%`,
            })
            .orWhere('LOWER(user.address) LIKE LOWER(:address)', {
              address: `%${this._filter.q}%`,
            }),
        ),
      );

    return hasPagination
      ? Pagination.create(queryBuilder)
          .paginate(this._pagination)
          .then((result) => result)
          .catch(handleInternalError)
      : queryBuilder
          .getMany()
          .then((predicates) => predicates)
          .catch(handleInternalError);
  }

  static formattDuplicatedAddress(
    res: AddressBook[],
    _singleWk: string,
    includePersonal: boolean,
    groupWorkspace: string,
  ): AddressBook[] {
    return res.reduce((acc, currentItem) => {
      const existingItem = acc.find(
        (item) => item.user.id === currentItem.user.id,
      );

      if (!existingItem) {
        acc.push(currentItem);
        return acc;
      }

      if (includePersonal && currentItem.owner.id === groupWorkspace) {
        const existingIndex = acc.findIndex(
          (item) => item.user.id === currentItem.user.id,
        );
        acc[existingIndex] = currentItem;
      }

      // Se já existe, retornar de preferencia o que tem o wk igual ao single
      // if (currentItem.owner.id === (includePersonal ? singleWk : groupWorkspace)) {
      //   const existingIndex = acc.findIndex(
      //     item => item.user.id === currentItem.user.id,
      //   );
      //   acc[existingIndex] = currentItem;
      // }

      return acc;
    }, []);
  }

  async findById(id: string): Promise<AddressBook> {
    return AddressBook.findOne({
      where: { id },
    })
      .then((contact) => {
        if (!contact) {
          throw new NotFound({
            type: ErrorTypes.NotFound,
            title: 'Contact not found',
            detail: `No contact was found for the provided ID: ${id}.`,
          });
        }

        return contact;
      })
      .catch((e) => {
        if (e instanceof GeneralError) throw e;

        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction findById',
          detail: e,
        });
      });
  }

  async update(
    id: string,
    payload: IUpdateAddressBookPayload,
  ): Promise<AddressBook> {
    return AddressBook.update({ id }, payload)
      .then(() => this.findById(id))
      .catch((e) => {
        throw new Internal({
          type: ErrorTypes.Internal,
          title: 'Error on transaction update',
          detail: e,
        });
      });
  }

  async delete(id: string) {
    return await AddressBook.update({ id }, { deletedAt: new Date() })
      .then(() => true)
      .catch(() => {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Contact not found',
          detail: `Contact with id ${id} was not found`,
        });
      });
  }
}
