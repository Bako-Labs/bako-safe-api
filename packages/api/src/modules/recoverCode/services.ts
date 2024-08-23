import { RecoverCode } from '@models/index';

import { ErrorTypes } from '@utils/error/GeneralError';
import Internal from '@utils/error/Internal';

import { NotFound } from '@src/utils/error';
import type { DeepPartial } from 'typeorm';
import type { ICreateRecoverCodePayload, IRecoverCodeService } from './types';

export class RecoverCodeService implements IRecoverCodeService {
  async create(paylaod: ICreateRecoverCodePayload) {
    try {
      const partialPayload: DeepPartial<RecoverCode> = paylaod;
      await RecoverCode.create(partialPayload).save();
      return this.findLast();
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Create,
        title: 'Error on recover code create',
        detail: e,
      });
    }
  }

  async update(id: string, payload: Partial<RecoverCode>) {
    try {
      const recoverCode = await RecoverCode.findOne({ where: { id } });
      if (!recoverCode) {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Recover code not found',
          detail: `Recover code with ID ${id} not found`,
        });
      }

      Object.assign(recoverCode, payload);
      return await recoverCode.save();
    } catch (e) {
      if (e instanceof NotFound) throw e;

      throw new Internal({
        type: ErrorTypes.Update,
        title: 'Error on recover code update',
        detail: e,
      });
    }
  }

  async findByCode(code: string) {
    try {
      const data = await RecoverCode.findOne({ where: { code } });
      return data;
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on recover code find',
        detail: e,
      });
    }
  }

  async findLast() {
    try {
      return await RecoverCode.createQueryBuilder('rc')
        .select()
        .innerJoin('rc.owner', 'owner')
        .addSelect(['owner.id'])
        .take(1)
        .orderBy('rc.createdAt', 'DESC')
        .getOne();
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on recover code find last',
        detail: e,
      });
    }
  }
}
