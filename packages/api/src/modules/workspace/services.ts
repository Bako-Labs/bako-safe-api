import { BakoSafe } from 'bakosafe';

import { PermissionAccess, TypeUser, type User } from '@src/models';
import {
  type IPermissions,
  PermissionRoles,
  Workspace,
  defaultPermissions,
} from '@src/models/Workspace';
import { ErrorTypes, NotFound } from '@src/utils/error';
import GeneralError from '@src/utils/error/GeneralError';
import Internal from '@src/utils/error/Internal';
import { type IOrdination, setOrdination } from '@src/utils/ordination';
import {
  type IPagination,
  Pagination,
  type PaginationParams,
} from '@src/utils/pagination';

import { IconUtils } from '@utils/icons';

import { AddressValidator } from '@src/utils';
import { UserService } from '../user/service';
import type { IFilterParams, IWorkspaceService } from './types';

export class WorkspaceService implements IWorkspaceService {
  private _ordination: IOrdination<Workspace> = {
    orderBy: 'updatedAt',
    sort: 'DESC',
  };
  private _pagination: PaginationParams;
  private _filter: IFilterParams;

  filter(filter: IFilterParams) {
    this._filter = filter;
    return this;
  }

  paginate(pagination?: PaginationParams) {
    this._pagination = pagination;
    return this;
  }

  ordination(ordination?: IOrdination<Workspace>) {
    this._ordination = setOrdination(ordination);
    return this;
  }

  async list(): Promise<IPagination<Workspace> | Workspace[]> {
    try {
      const hasPagination = !!this._pagination;
      const hasOrdination = !!this._ordination;
      const enableSingleFilter = this._filter.single !== undefined;
      const queryBuilder = Workspace.createQueryBuilder('w')
        .leftJoin('w.owner', 'owner')
        .leftJoin('w.members', 'users')
        .leftJoin('w.predicates', 'predicates')
        .select([
          'w', // Todos os campos de Workspace
          'owner.id',
          'owner.address',
          'owner.name',
          'owner.avatar',
          'users.id',
          'users.address',
          'users.name',
          'users.avatar',
          'predicates.id', // Seleção específica: apenas o campo 'id' de Predicate com alias
        ]);

      enableSingleFilter &&
        queryBuilder.andWhere('single = :single', {
          single: this._filter.single,
        });

      this._filter.q &&
        queryBuilder.where('LOWER(w.name) LIKE LOWER(:name)', {
          name: `%${this._filter.q}%`,
        });

      this._filter.owner &&
        queryBuilder.andWhere(
          `${
            this._filter.owner.length <= 36 ? 'owner.id' : 'owner.address'
          } = :owner`,
          {
            owner: this._filter.owner,
          },
        );

      this._filter.user &&
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('*')
            .from('workspace_users', 'wu')
            .where('wu.workspace_id = w.id')
            .andWhere(
              '(wu.user_id = (SELECT u.id FROM users u WHERE u.id = :user))',
              { user: this._filter.user },
            )
            .getQuery();

          return `EXISTS ${subQuery}`;
        });

      this._filter.id &&
        queryBuilder.andWhere('w.id = :id', {
          id: this._filter.id,
        });

      hasOrdination &&
        queryBuilder.orderBy(
          `w.${this._ordination.orderBy}`,
          this._ordination.sort,
        );
      return hasPagination
        ? await Pagination.create(queryBuilder).paginate(this._pagination)
        : await queryBuilder.getMany();
    } catch (error) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on workspace list',
        detail: error,
      });
    }
  }

  async create(payload: Partial<Workspace>): Promise<Workspace> {
    try {
      // Criar e salvar o Workspace
      await Workspace.create(payload).save();
      return this.findLast();
    } catch (error) {
      if (error instanceof GeneralError) {
        throw error;
      }

      throw new Internal({
        type: ErrorTypes.Create,
        title: 'Error on workspace create',
        detail: error,
      });
    }
  }

  async findByUser(user_id: string, single = false): Promise<Workspace[]> {
    const a = await Workspace.query(
      `SELECT w.*,
        COUNT (p.id)::INTEGER AS predicates,
        (
          SELECT json_agg(jsonb_build_object(
            'id', u.id,
            'name', u.name,
            'avatar', u.avatar,
            'address', u.address
          ))
          FROM workspace_users wu
          INNER JOIN users u ON u.id = wu.user_id
          WHERE wu.workspace_id = w.id
        ) AS members
      FROM workspace w
      INNER JOIN workspace_users wu ON wu.workspace_id = w.id
      INNER JOIN users u ON u.id = wu.user_id
      LEFT JOIN predicates p ON p.workspace_id = w.id
      WHERE u.id = $1  AND w.single = $2
      GROUP BY w.id`,
      [user_id, single],
    );
    return a;
  }

  async update(payload: Partial<Workspace>): Promise<boolean> {
    const w = Object.assign(
      await Workspace.findOne({ where: { id: payload.id } }),
      payload,
    );

    return w
      .save()
      .then(() => {
        return true;
      })
      .catch((error) => {
        if (error instanceof GeneralError) throw error;

        throw new Internal({
          type: ErrorTypes.Update,
          title: 'Error on workspace update',
          detail: error,
        });
      });
  }

  async includeMembers(members: string[], owner: User, workspace?: string) {
    const _members: User[] = [];

    const _permissions: IPermissions = {};
    for await (const member of [...members, owner.id]) {
      const m = AddressValidator.isAddress(member)
        ? await new UserService()
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
            })
        : await new UserService().findOne(member).then((data) => data);
      _members.push(m);
    }

    _members.map((m) => {
      _permissions[m.id] =
        m.id === owner.id
          ? defaultPermissions[PermissionRoles.OWNER]
          : defaultPermissions[PermissionRoles.VIEWER];
    });
    const hasOwner =
      workspace &&
      (await new WorkspaceService()
        .filter({ id: workspace })
        .list()
        .then((data) => {
          const { owner, permissions } = data[0];
          _members.map((member) => {
            _permissions[member.id] = permissions[member.id];
          });
          return _members.find((member) => member.id === owner.id);
        }));

    if (workspace && !hasOwner) {
      throw new Internal({
        type: ErrorTypes.NotFound,
        title: 'Owner not found',
        detail: 'Owner cannot be removed from workspace',
      });
    }

    return { _members, _permissions };
  }

  findById: (id: string) => Promise<Workspace> = async (id) => {
    try {
      const workspace = await Workspace.createQueryBuilder('w')
        .leftJoinAndSelect('w.owner', 'owner')
        .leftJoinAndSelect('w.members', 'members')
        .loadRelationCountAndMap('w.predicates', 'w.predicates')
        .where('w.id = :id', { id })
        .getOne();

      if (!workspace) {
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Workspace not found',
          detail: `Workspace with id ${id} not found`,
        });
      }

      return workspace;
    } catch (error) {
      if (error instanceof GeneralError) throw error;

      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on workspace find',
        detail: error,
      });
    }
  };

  /**
   * Formatar o capo de permissões do workspace, inserindo o assinante
   * caso o usuário ainda nao esteja na lista de membros, um novo field é criado, e o id do predicado adicionado
   * caso o usuário já esteja na lista de membros, o id do predicado é adicionado
   *
   * @params signers: string[] - lista de endereços dos signatários
   * @params predicate: string - id do predicado
   * @params worksapce: string - id do workspace
   *
   * @return Workspace
   *
   */
  async includeSigner(
    signers: string[],
    predicate: string,
    worksapce: string,
  ): Promise<void> {
    return await Workspace.findOne({ where: { id: worksapce } })
      .then(async (workspace) => {
        const p = workspace.permissions;
        signers.map((s) => {
          if (p[s]) {
            p[s][PermissionRoles.SIGNER] = [
              ...p[s][PermissionRoles.SIGNER].filter(
                (i) =>
                  i !== PermissionAccess.ALL && i !== PermissionAccess.NONE,
              ),
              predicate,
            ];
          } else {
            p[s] = {
              ...defaultPermissions[PermissionRoles.SIGNER],
              [PermissionRoles.SIGNER]: [predicate],
            };
          }
          return;
        });
        workspace.permissions = p;
        await workspace.save();
        return;
      })
      .catch((error) => {
        if (error instanceof GeneralError) throw error;
        throw new Internal({
          type: ErrorTypes.Update,
          title: 'Error on workspace update',
          detail: error,
        });
      });
  }

  /**
   * Formatar os dados para usuário nao logado, removendo as infos delicadas
   *
   * @params w: Workspace[]
   *
   * @return o workspace resumido, apenas com nome, avatar e endereco do owner e membros
   *
   */
  static formatToUnloggedUser(w: Workspace[]) {
    return w.map((workspace) => {
      return {
        id: workspace.id,
        name: workspace.name,
        avatar: workspace.avatar,
        single: workspace.single,
        description: workspace.description,
        owner: {
          name: workspace.owner.name,
          avatar: workspace.owner.avatar,
          address: workspace.owner.address,
        },
        members: workspace.members.map((member) => {
          return {
            name: member.name,
            avatar: member.avatar,
            address: member.address,
          };
        }),
        predicates: workspace.predicates.length,
        permissions: workspace.permissions,
      };
    });
  }

  async findLast() {
    try {
      return await Workspace.createQueryBuilder('w')
        .innerJoinAndSelect('w.owner', 'owner')
        .innerJoinAndSelect('w.members', 'members')
        .orderBy('w.createdAt', 'DESC')
        .take(1)
        .getOne();
    } catch (e) {
      throw new Internal({
        type: ErrorTypes.Internal,
        title: 'Error on workspace find',
        detail: e,
      });
    }
  }
}
