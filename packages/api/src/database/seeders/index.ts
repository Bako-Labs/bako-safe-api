import path from 'node:path';
import * as glob from 'glob';

import { SeedsMonitor } from '@src/models/SeedsMonitor';

const runSeeders = async () => {
  try {
    const files = glob.sync(`${__dirname}/**/*.{js,ts}`).sort();

    const seeders: string[] = [];

    for (const file of files.filter((file) => !file.includes('index'))) {
      const filename = file.replace(__dirname, '');
      const r = await SeedsMonitor.findOne({
        where: {
          filename,
        },
      });

      !r ? seeders.push(file) : null;
    }

    for (const seeder of seeders) {
      const [, seedName] = seeder.split('seeders');
      const seed = await import(path.resolve(seeder));
      await seed.default();

      await SeedsMonitor.create({
        filename: seedName,
      }).save();

      console.log(`Seeder ${seedName} has been executed`);
    }
  } catch (e) {
    console.error(e);
  }
};

export default runSeeders;
