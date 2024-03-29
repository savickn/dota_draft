
// used to run server-side tasks (e.g. scraping, db maintainence, emailing)

import mongoose from 'mongoose';
import Winston from 'winston';

//import redis_client from './dependencies/redis';
import * as scrapers from './scraper/scrape';


const logger = Winston.createLogger({
  level: 'info',
  format: Winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new Winston.transports.File({ filename: 'error.log', level: 'error' }),
    new Winston.transports.File({ filename: 'combined.log' })
  ]
});

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/dota_draft_dev')
  .then(async (db) => {
    logger.log('info', 'Connected to mongoDB!');
    console.log('Connected to MongoDB!');
    
    try {
      console.log('cli args --> ', process.argv);
      await scrapers.scrapeAll();
      
    } catch(error) {
      console.error('catch block error --> ', error);
      throw error;
    }

    //process.exit(); // obv not ideal !!!
    //await db.disconnect();
    //mongoose.connection.close(); // throws error 'Topology was destroyed'

  }).catch((error) => {
    logger.log('error', 'Please make sure Mongodb is installed and running!');
    throw error;
  });

