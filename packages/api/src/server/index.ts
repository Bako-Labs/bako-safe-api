import { BakoSafe } from 'bakosafe';

import app from './app';
import Bootstrap from './bootstrap';

const {
  API_PORT,
  PORT,
  API_ENVIRONMENT,
  UI_URL,
  API_URL,
  FUEL_PROVIDER,
  GAS_LIMIT,
  MAX_FEE,
  COIN_MARKET_CAP_API_KEY,
} = process.env;

const start = async () => {
  const port = API_PORT || PORT || 3333;

  console.log('[ENVIRONMENTS]: ', {
    API_PORT,
    PORT,
    API_ENVIRONMENT,
    UI_URL,
    API_URL,
    FUEL_PROVIDER,
    GAS_LIMIT,
    MAX_FEE,
    COIN_MARKET_CAP_API_KEY,
  });

  await Bootstrap.start();

  console.log('[APP] Storages started', {
    active_sessions: app._sessionCache.getActiveSessions(),
    active_quotes: app._quoteCache.getActiveQuotes(),
  });

  app.serverApp.listen(port, () => {
    console.log(
      `[APP] Application running in http://localhost:${port} mode ${API_ENVIRONMENT}`,
    );
  });
};

BakoSafe.setProviders({
  SERVER_URL: API_URL,
  CLIENT_URL: UI_URL,
  CHAIN_URL: FUEL_PROVIDER,
});

BakoSafe.setGasConfig({
  GAS_LIMIT: Number(GAS_LIMIT) ?? 10000000,
  MAX_FEE: Number(MAX_FEE) ?? 1000000,
});

try {
  start();
} catch (e) {
  console.log(e);
}
