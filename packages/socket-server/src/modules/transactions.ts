import crypto from 'node:crypto';
import { SocketEvents, SocketUsernames } from '@src/types';
import type { DatabaseClass } from '@utils/database';
import {
  BakoSafe,
  type ITransactionSummary,
  TransactionStatus,
  Vault,
} from 'bakosafe';
import type { TransactionRequestLike } from 'fuels';
import type { Socket } from 'socket.io';

export interface IEventTX_REQUEST {
  _transaction: TransactionRequestLike;
  _address: string;
}

export interface IEventTX_CONFIRM {
  tx: TransactionRequestLike;
  operations: any;
}

interface IEvent<D> {
  data: D;
  socket: Socket;
  database: DatabaseClass;
}

const { UI_URL, API_URL } = process.env;

export const txConfirm = async ({
  data,
  socket,
  database,
}: IEvent<IEventTX_CONFIRM>) => {
  const { sessionId, username, request_id } = socket.handshake.auth;
  const room = `${sessionId}:${SocketUsernames.CONNECTOR}:${request_id}`;
  const { origin, host } = socket.handshake.headers;

  const { tx, operations } = data;
  const { auth } = socket.handshake;
  try {
    // ------------------------------ [VALIDACOES] ------------------------------
    // validar se o origin é diferente da url usada no front...adicionar um .env pra isso
    console.log('[TX_CONFIRM]', {
      origin,
      UI_URL,
      room,
    });

    if (origin !== UI_URL) return;

    // ------------------------------ [DAPP] ------------------------------
    const dapp = await database.query(
      `
				SELECT d.*, u.id AS user_id, u.address AS user_address, c.id AS current_vault_id, c.provider AS current_vault_provider
				FROM dapp d
				JOIN "users" u ON d.user = u.id
				JOIN "predicates" c ON d.current = c.id
				WHERE d.session_id = $1  
			`,
      [auth.sessionId],
    );

    if (!dapp) return;

    // ------------------------------ [CODE] ------------------------------
    const code = await database.query(
      `
				SELECT *
				FROM recover_codes
				WHERE origin = $1
				AND owner = $2
				AND used = false
				AND valid_at > NOW()
				ORDER BY valid_at DESC
				LIMIT 1;
			`,
      [host, dapp.user_id],
    );

    if (!code) return;

    // ------------------------------ [CODE] ------------------------------

    // ------------------------------ [TX] ------------------------------
    BakoSafe.setProviders({
      SERVER_URL: API_URL,
      CHAIN_URL: dapp.current_vault_provider,
    });
    const predicate = await Vault.create({
      id: dapp.current_vault_id,
      address: dapp.user_address,
      token: code.code,
    });
    const _tx = await predicate
      .BakoSafeIncludeTransaction(tx)
      .then((tx) => tx)
      .catch((e) => {
        console.log('[ERRO NA TX]', e);
        return undefined;
      });
    // ------------------------------ [TX] ------------------------------

    // ------------------------------ [SUMMARY] ------------------------------
    const transactionSummary: ITransactionSummary = {
      type: 'connector',
      name: dapp.name,
      origin: dapp.origin,
      operations: operations.operations,
    };
    await database.query(
      `
				UPDATE transactions
				SET summary = $1
				WHERE id = '${_tx.BakoSafeTransactionId}'
			`,
      [JSON.stringify(transactionSummary)],
    );
    // ------------------------------ [SUMMARY] ------------------------------

    // ------------------------------ [INVALIDATION] ------------------------------
    await database.query(
      `
				DELETE FROM recover_codes
				WHERE id = $1
			`,
      [code.id],
    );
    // ------------------------------ [INVALIDATION] ------------------------------

    // ------------------------------ [EMIT] ------------------------------
    socket.to(room).emit(SocketEvents.DEFAULT, {
      username,
      room: sessionId,
      request_id,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.TX_CONFIRM,
      data: {
        id: _tx.getHashTxId(),
        status: '[SUCCESS]',
      },
    });
    // ------------------------------ [EMIT] ------------------------------
  } catch (e) {
    console.log(e);
    socket.to(room).emit(SocketEvents.DEFAULT, {
      username,
      room: sessionId,
      request_id,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.TX_REQUEST,
      data: {
        id: undefined,
        status: '[ERROR]',
      },
    });
  }
};

export const txRequest = async ({
  data,
  socket,
  database,
}: IEvent<IEventTX_REQUEST>) => {
  try {
    const { sessionId, username, request_id } = socket.handshake.auth;
    const { _transaction } = data;
    const { origin, host } = socket.handshake.headers;
    const { auth } = socket.handshake;

    const dapp = await database.query(
      `
				SELECT d.*, u.id AS user_id,
				u.address AS user_address,
				c.id AS current_vault_id, 
				c.name AS current_vault_name, 
				c.description AS current_vault_description, 
				c.provider AS current_vault_provider
				FROM dapp d
				JOIN "users" u ON d.user = u.id
				JOIN "predicates" c ON d.current = c.id
				WHERE d.session_id = $1  
			`,
      [auth.sessionId],
    );
    const isValid = dapp && dapp.origin === origin;

    //todo: adicionar emissao de erro
    if (!isValid) return;

    const vault = await database.query(
      `
				SELECT * from predicates
				WHERE id = $1
			`,
      [dapp.current_vault_id],
    );

    if (!vault) return;

    const code = await database.query(
      `
				INSERT INTO recover_codes (origin, owner, type, code, valid_at, metadata, used)
				VALUES ($1, $2, 'AUTH_ONCE', $3, NOW() + INTERVAL '2 minutes', $4, false)
				RETURNING *;
			`,
      [
        host,
        dapp.user_id,
        `code${crypto.randomUUID()}`,
        `${JSON.stringify({ uses: 0 })}`,
      ],
    );

    const tx_pending = await database.query(
      `
				SELECT COUNT(*)
				FROM transactions t
				WHERE t.predicate_id = $1 
				AND t.status = $2
				AND t.deleted_at IS NULL;
			`,
      [vault.id, TransactionStatus.AWAIT_REQUIREMENTS],
    );
    //console.log('[TX_PENDING]', tx_pending, Number(tx_pending.count) > 0)

    const room = `${sessionId}:${SocketUsernames.UI}:${request_id}`;
    socket.to(room).emit(SocketEvents.DEFAULT, {
      username,
      room: sessionId,
      to: SocketUsernames.UI,
      type: SocketEvents.TX_REQUEST,
      data: {
        dapp: {
          name: dapp.name,
          description: dapp.description,
          origin: dapp.origin,
        },
        vault: {
          name: dapp.current_vault_name,
          description: dapp.current_vault_description,
          address: vault.predicate_address,
          provider: dapp.current_vault_provider,
          pending_tx: Number(tx_pending.count) > 0,
        },
        tx: _transaction,
        validAt: code.valid_at,
      },
    });
  } catch (e) {
    console.log(e);
  }
};
