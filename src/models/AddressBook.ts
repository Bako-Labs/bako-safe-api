import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { Base } from './Base';
import { User } from './User';

@Entity('address_book')
class AddressBook extends Base {
  @Column()
  nickname: string;

  @Column()
  created_by: string;

  @JoinColumn({ name: 'created_by' })
  @ManyToOne(() => User)
  createdBy: User;

  @Column()
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  @OneToOne(() => User)
  user: User;
}

export default AddressBook;
