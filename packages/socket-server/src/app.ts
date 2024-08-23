import express, { type Response } from 'express';
import http from 'node:http';
import socketIo from 'socket.io';
import { txConfirm, txRequest } from '@modules/transactions';
import { DatabaseClass } from '@utils/database';
import { SocketEvents } from './types';

const { SOCKET_PORT, SOCKET_TIMEOUT_DICONNECT, SOCKET_NAME } = Bun.env;

export type SocketServerParams = {
  port?: number;
  timeout?: number;
  name?: string;
};

export const defaultParams: SocketServerParams = {
  port: Number(SOCKET_PORT) ?? 3000,
  timeout: Number(SOCKET_TIMEOUT_DICONNECT),
  name: SOCKET_NAME ?? 'socket-server',
};

export class SocketServer {
  private server: http.Server;
  private app: express.Application;
  private port: number;
  private io: socketIo.Server;
  private database!: DatabaseClass;
  private name: string;

  constructor({ port, timeout, name }: SocketServerParams = defaultParams) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = port as number;
    this.io = new socketIo.Server(this.server, {
      connectTimeout: Number(timeout),
      cors: {
        origin: '*',
      },
    });
    this.name = name as string;
    this.setup();
  }

  private async setup() {
    this.database = await DatabaseClass.connect();
    this.app.get('/health', ({ res }) =>
      (res as Response).status(200).json({ status: `${this.name} is alive` }),
    );

    this.io.on(SocketEvents.CONNECT, async (socket) => {
      const { sessionId, username, request_id } = socket.handshake.auth;
      const requestId = request_id ?? '';
      const room = `${sessionId}:${username}:${requestId}`;
      await socket.join(room);

      socket.on(SocketEvents.TX_CONFIRM, (data) =>
        txConfirm({ data, socket, database: this.database }),
      );

      socket.on(SocketEvents.TX_REQUEST, (data) =>
        txRequest({ data, socket, database: this.database }),
      );

      socket.on(SocketEvents.DEFAULT, (data) => {
        const { sessionId, to, request_id } = data;
        const requestId = request_id ?? '';
        const room = `${sessionId}:${to}:${requestId}`;

        socket.to(room).emit(SocketEvents.DEFAULT, data);
      });

      socket.on(SocketEvents.DISCONNECT, () => {
        socket.disconnect(true);
        socket.rooms.forEach((room) => socket.leave(room));
        socket.removeAllListeners();
      });
    });
  }

  public async start() {
    this.server.listen({ port: this.port });
  }

  public async stop() {
    this.server.close();
    this.database.disconnect();
  }
}
