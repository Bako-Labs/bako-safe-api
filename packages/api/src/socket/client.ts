import { sha256 } from 'fuels';
import { type Socket, io } from 'socket.io-client';
import { type IMessage, SocketEvents, SocketUsernames } from './types';

export class SocketClient {
  socket: Socket = null;

  constructor(sessionId: string, origin: string) {
    const auth = {
      username: SocketUsernames.API,
      data: new Date(),
      sessionId,
      origin,
    };

    const isDev = process.env.NODE_ENV === 'development';
    const URL = isDev ? process.env.SOCKET_URL : process.env.API_URL;

    this.socket = io(URL, { autoConnect: true, auth });
  }

  // Método para enviar uma mensagem para o servidor
  sendMessage(message: IMessage) {
    console.log('[EMITINDO MENSAGEM]: ', message, SocketEvents.DEFAULT);
    this.socket.emit(SocketEvents.DEFAULT, message);
  }

  // Método para desconectar do servidor Socket.IO
  disconnect() {
    this.socket.disconnect();
  }
}
