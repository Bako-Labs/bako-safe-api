import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

import AddressBook from './AddressBook';
import { Base } from './Base';
import { Predicate } from './Predicate';
import { User } from './User';

/**
 * vaults       -> MUITOS VAULTS <-> 1 WORKSPACE
 * book         -> MUITOS BOOKS <-> 1 WORKSPACE
 *
 * users        -> MUITOS USERS <-> MUITOS WORKSPACES
 */

/**
 * PERMISSIONS TYPING
 */
export enum PermissionRoles {
  OWNER = 'OWNER', // owner of the workspace, THIS ROLE CAN'T BE CHANGED
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SIGNER = 'SIGNER',
  VIEWER = 'VIEWER',
}

export enum PermissionAccess {
  ALL = '*',
  NONE = '',
}

//todo: change to specific permissions of each role depends the complete flow
export const defaultPermissions = {
  [PermissionRoles.OWNER]: {
    OWNER: [PermissionAccess.ALL],
    ADMIN: [PermissionAccess.NONE],
    MANAGER: [PermissionAccess.NONE],
    SIGNER: [PermissionAccess.NONE],
    VIEWER: [PermissionAccess.NONE],
  },
  [PermissionRoles.ADMIN]: {
    OWNER: [PermissionAccess.NONE],
    ADMIN: [PermissionAccess.ALL],
    MANAGER: [PermissionAccess.NONE],
    SIGNER: [PermissionAccess.NONE],
    VIEWER: [PermissionAccess.NONE],
  },
  [PermissionRoles.MANAGER]: {
    OWNER: [PermissionAccess.NONE],
    ADMIN: [PermissionAccess.NONE],
    MANAGER: [PermissionAccess.ALL],
    SIGNER: [PermissionAccess.NONE],
    VIEWER: [PermissionAccess.NONE],
  },
  [PermissionRoles.SIGNER]: {
    OWNER: [PermissionAccess.NONE],
    ADMIN: [PermissionAccess.NONE],
    MANAGER: [PermissionAccess.NONE],
    SIGNER: [PermissionAccess.NONE],
    VIEWER: [PermissionAccess.NONE],
  },
  [PermissionRoles.VIEWER]: {
    OWNER: [PermissionAccess.NONE],
    ADMIN: [PermissionAccess.NONE],
    MANAGER: [PermissionAccess.NONE],
    SIGNER: [PermissionAccess.NONE],
    VIEWER: [PermissionAccess.ALL],
  },
};

export interface IPermissions {
  [key: string]: {
    [key in PermissionRoles]: string[];
  };
}
/**
 * PERMISSIONS TYPING
 */

@Entity('workspace')
class Workspace extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  avatar: string;

  @JoinColumn({ name: 'owner_id' })
  @OneToOne(() => User, { cascade: true })
  owner: User;

  @Column() // if true, the workspace is a single workspace
  single: boolean;

  @Column({
    name: 'permissions',
    type: 'jsonb',
  })
  permissions: IPermissions;

  @JoinColumn()
  @OneToMany(
    () => Predicate,
    (predicate) => predicate.workspace,
    { cascade: true },
  )
  predicates: Predicate[];

  @JoinColumn({ name: 'address_book' })
  @OneToMany(
    () => AddressBook,
    (adb) => adb.owner,
    { cascade: true },
  )
  addressBook: AddressBook[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'workspace_users',
    joinColumn: { name: 'workspace_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];
}

export { Workspace };

// -- Criação de índice para a coluna 'owner_id' na tabela 'workspace'
// CREATE INDEX idx_workspace_owner_id ON workspace(owner_id);

// -- Criação de índice para a coluna 'workspace_id' na tabela 'predicates'
// CREATE INDEX idx_predicates_workspace_id ON predicates(workspace_id);

// -- Criação de índice para a coluna 'workspace_id' na tabela 'workspace_users'
// CREATE INDEX idx_workspace_users_workspace_id ON workspace_users(workspace_id);

// -- Criação de índice para a coluna 'user_id' na tabela 'workspace_users'
// CREATE INDEX idx_workspace_users_user_id ON workspace_users(user_id);
