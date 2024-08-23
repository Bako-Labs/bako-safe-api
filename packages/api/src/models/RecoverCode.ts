import { Address } from 'fuels';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Base } from './Base';

import { User } from './User';

export enum RecoverCodeType {
  AUTH = 'AUTH',
  TX_CONNECTOR = 'TX_CONNECTOR',
  AUTH_ONCE = 'AUTH_ONCE',
}

@Entity('recover_codes')
class RecoverCode extends Base {
  @Column()
  origin: string;

  @JoinColumn({ name: 'owner' })
  @OneToOne(() => User)
  owner: User;

  @Column()
  type: RecoverCodeType;

  @Column()
  code: string;

  @Column({ name: 'valid_at' })
  validAt: Date;

  @Column({ name: 'metadata', type: 'jsonb' })
  metadata: { [key: string]: string | number | boolean };

  @Column()
  used: boolean;

  @BeforeInsert()
  insertCreatedAtAndUpdatedAt() {
    this.code = `code${Address.fromRandom().toHexString()}`;
    this.used = false;
  }
}

export { RecoverCode };
