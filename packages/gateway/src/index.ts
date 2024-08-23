import 'graphql-import-node';

import { BakoSafe } from 'bakosafe';

import { Database } from '@/lib';
import { GatewayServer } from '@/server';

const { GATEWAY_PORT, FUEL_PROVIDER, API_URL } = process.env;

BakoSafe.setProviders({
  SERVER_URL: API_URL,
  CHAIN_URL: FUEL_PROVIDER,
});

const main = async () => {
  const server = new GatewayServer(GATEWAY_PORT);
  const database = await Database.connect();
  server.setDatabase(database);
  server.start();
};

main().catch((reason) => {
  console.error('[GATEWAY SERVER] Failed to start server', reason);
  process.exit(1);
});
