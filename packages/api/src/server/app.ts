import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Express from 'express';
import morgan from 'morgan';

import { router } from '@src/routes';
import { TVLCronJob, isDevMode } from '@src/utils';

import { handleErrors } from '@middlewares/index';
import { QuoteStorage, SessionStorage } from './storage';

class App {
  private readonly app: Express.Application;
  private sessionCache: SessionStorage;
  private quoteCache: QuoteStorage;

  constructor() {
    this.app = Express();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandler();
    this.initJobs();

    this.sessionCache = SessionStorage.start();
    this.quoteCache = QuoteStorage.start();
  }

  private initMiddlewares() {
    this.app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
    this.app.use(bodyParser.json({ limit: '20mb' }));
    this.app.use(cookieParser());
    this.app.use(Express.json());
    this.app.use(cors());

    if (isDevMode) {
      this.app.use(morgan('dev'));
    }
  }

  private initRoutes() {
    this.app.use(router);
  }

  private initErrorHandler() {
    this.app.use(handleErrors);
  }

  private initJobs() {
    const isValid = (!!isDevMode && !isDevMode) ?? false;

    // run only production
    if (isValid) {
      TVLCronJob.start();
    }
  }

  get serverApp() {
    return this.app;
  }

  get _sessionCache() {
    return this.sessionCache;
  }

  get _quoteCache() {
    return this.quoteCache;
  }
}

const app = new App();

Object.freeze(app);

export default app;
