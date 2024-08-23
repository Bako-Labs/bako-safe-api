import { Base } from '@models/Base';
import { Predicate } from '@models/Predicate';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export const DEFAULT_TRANSACTION_TITLE = 'Contract deployment';

export interface APITokenConfig {
  transactionTitle: string;
}

@Entity('api_tokens')
class APIToken extends Base {
  @Column()
  name: string;

  @Column({ select: false })
  token: string;

  @Column({
    type: 'jsonb',
  })
  config: APITokenConfig = {
    transactionTitle: DEFAULT_TRANSACTION_TITLE,
  };

  @JoinColumn({ name: 'predicate_id' })
  @ManyToOne(() => Predicate)
  predicate: Predicate;
}

export { APIToken };
