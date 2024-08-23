import dotenv from 'dotenv';

import { databaseInstance } from '@src/database/connection';
import runSeeders from '@src/database/seeders';

class Bootstrap {
  static async connectDatabase() {
    await databaseInstance.initialize();
    await databaseInstance.runMigrations();
    // await runSeeders();
  }

  static startEnv() {
    dotenv.config();
  }

  static async start() {
    Bootstrap.startEnv();
    await Bootstrap.connectDatabase();
  }
}

export default Bootstrap;
