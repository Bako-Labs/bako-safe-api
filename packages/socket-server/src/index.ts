import http from 'node:http';
import express from 'express';
import socketIo from 'socket.io';

import { txConfirm, txRequest } from '@modules/transactions';
import { DatabaseClass } from '@utils/database';
import { SocketEvents } from './types';

const { SOCKET_PORT, SOCKET_TIMEOUT_DICONNECT, SOCKET_NAME } = process.env;

const app = express();
let database: DatabaseClass;
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  connectTimeout: Number(SOCKET_TIMEOUT_DICONNECT), // 60 mins
  cors: {
    origin: '*',
  },
});

// Health Check
app.get('/health', ({ res }) =>
  res
    .status(200)
    .send({ status: 'ok', message: `Health check ${SOCKET_NAME} passed` }),
);

// Configuração do Socket.IO
io.on(SocketEvents.CONNECT, async (socket) => {
  const { sessionId, username, request_id } = socket.handshake.auth;
  const requestId = request_id === undefined ? '' : request_id;

  const room = `${sessionId}:${username}:${requestId}`;

  await socket.join(room);
  console.log('Conexão estabelecida com o cliente:', room);
  //console.log('[CONEXAO]: ', socket.handshake.auth, socket.id)
  /* 
		[UI] emite esse evento quando o usuário confirma a tx 
			- verifica se o evento veio da origem correta -> BAKO-UI [http://localhost:5174, https://safe.bako.global]
			- recupera as infos do dapp que está tentando criar a tx pelo sessionId
			- gera uma credencial temporária (code) para ser usada para criar a tx com o pacote bakosafe
			- usa a sdk da bako safe para instanciar o vault connectado ao dapp
			- cria a tx com a sdk da bako safe, usando o code gerado
			- atualiza o sumary da tx
			- cria uma invalidacao para o code gerado
			- emite uma mensagem para o [CONNECTOR] com o resultado da tx [TX_EVENT_CONFIRMED] ou [TX_EVENT_FAILED]
			- todo: nao muito importante, mas é necessário tipar operations
	*/
  socket.on(SocketEvents.TX_CONFIRM, (data) =>
    txConfirm({ data, socket, database }),
  );

  /*
		[CONNECTOR] emite esse evento quando o usuário quer criar uma transação
			- recupera as infos do dapp que está tentando criar a tx pelo sessionId
			- verifica se as informações do dapp estão corretas com as vindas pela mensagem do connector
			- verifica se há transacoes pendentes nesse vault
			- cria um código temporário para ser usado na criação da tx (limite 2 mins)
			- emite uma mensagem para a [UI] com as informações da tx [TX_EVENT_REQUESTED] + o dapp
	 */
  socket.on(SocketEvents.TX_REQUEST, (data) =>
    txRequest({ data, socket, database }),
  );

  // Lidar com mensagens recebidas do cliente
  socket.on(SocketEvents.DEFAULT, (data) => {
    const { sessionId, to, request_id } = data;
    console.log('[SOCKET]: RECEIVED MESSAGE FROM', sessionId, to, request_id);
    const requestId = request_id === undefined ? '' : request_id;
    const room = `${sessionId}:${to}:${requestId}`;

    console.log('[SOCKET]: SEND MESSAGE TO', room);

    socket.to(room).emit(SocketEvents.DEFAULT, data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.handshake.auth);
    socket.disconnect(true);
    socket.rooms.forEach((room) => socket.leave(room));
    socket.removeAllListeners();
  });
});

const databaseConnect = async () => {
  database = await DatabaseClass.connect();
};

// Iniciar o servidor
const port = SOCKET_PORT || 3000;
server.listen(port, async () => {
  await databaseConnect();
  console.log(`Server runner on port ${port}`);
});
