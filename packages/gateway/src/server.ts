import type { Server } from 'node:http';
import cors from 'cors';
import express from 'express';

import { defaultSchemas, subscriptionSchema } from '@/graphql-api';
import {
  type Database,
  createGraphqlHttpHandler,
  createSubscriptionHandler,
} from '@/lib';
import { handleErrorMiddleware, tokenDecodeMiddleware } from '@/middlewares';

const { APP_NAME } = process.env;

export class GatewayServer {
  private static ROUTES_PATHS = {
    graphql: '/v1/graphql',
    graphqlSub: '/v1/graphql-sub',
    healthCheck: '/v1/health-check',
  };

  private readonly app: express.Application;
  private readonly port: number;
  private server: Server;
  private database: Database;

  constructor(port: number | string) {
    this.port = Number(port);
    this.app = express();
  }

  start() {
    this.beforeAllMiddlewares();
    this.routes();
    this.afterAllMiddlewares();
    this.server = this.app.listen(this.port, () => {
      console.log(
        `[GATEWAY_SERVER] Listening on http://localhost:${this.port}`,
      );
      console.log(
        `- GraphQL: http://localhost:${this.port}${GatewayServer.ROUTES_PATHS.graphql}`,
      );
      console.log(
        `- GraphQL Subscriptions: http://localhost:${this.port}${GatewayServer.ROUTES_PATHS.graphqlSub}`,
      );
    });
  }

  stop() {
    this.server.close();
  }

  setDatabase(database: Database) {
    this.database = database;
  }

  private beforeAllMiddlewares() {
    this.app.use(
      express.json({
        limit: '50mb',
      }),
    );
    this.app.use(cors());
    this.app.use((req, _res, next) => {
      console.log(`[${APP_NAME}] ${req.method} ${req.url}`);
      next();
    });
  }

  private afterAllMiddlewares() {
    this.app.use(handleErrorMiddleware);
  }

  private routes() {
    this.app.post(
      GatewayServer.ROUTES_PATHS.graphqlSub,
      tokenDecodeMiddleware,
      createSubscriptionHandler({
        schema: subscriptionSchema,
        defaultContext: { database: this.database },
      }),
    );
    this.app.post(
      GatewayServer.ROUTES_PATHS.graphql,
      tokenDecodeMiddleware,
      createGraphqlHttpHandler({
        appSchema: defaultSchemas.appSchema,
        fuelSchema: defaultSchemas.fuelSchema,
        defaultContext: { database: this.database },
      }),
    );
    this.app.get('/v1/ping', ({ res }) =>
      res.status(200).send({
        message: `${APP_NAME} is running - ${new Date().toISOString()}`,
      }),
    );
    this.app.get(GatewayServer.ROUTES_PATHS.healthCheck, ({ res }) =>
      res.status(200).send({ status: 'ok' }),
    );
  }
}
