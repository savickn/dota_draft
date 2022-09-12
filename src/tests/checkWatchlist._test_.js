

import mongoose from 'mongoose';
import redis from 'async-redis';

// import bluebird from 'bluebird';
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

import WatchFactory from '../server/api/Watch/watch.factory';
import PriceFactory from '../server/api/PriceHistory/price.factory';
import ProductFactory from '../server/api/Product/product.factory';
import UserFactory from '../server/api/User/user.factory';

import WatchModel from '../server/api/Watch/watch.model';
import PriceModel from '../server/api/PriceHistory/price.model';
import ProductModel from '../server/api/Product/product.model';
import UserModel from '../server/api/User/user.model';

import { checkWatchlists } from '../scripts/tasks/priceDropTracker';
import { priceDropEmailer } from '../scripts/tasks/sendEmailNotification';

let connection, client, 
  product, user, watch1, watch2, price1, price2;

mongoose.Promise = global.Promise;

// mongoose.connection.on('connected', () => {
//   console.log('Connection Established')
// })

// mongoose.connection.on('reconnected', () => {
//   console.log('Connection Reestablished')
// })

// mongoose.connection.on('disconnected', () => {
//   console.log('Connection Disconnected')
// })

// mongoose.connection.on('close', () => {
//   console.log('Connection Closed')
// })

// mongoose.connection.on('error', (error) => {
//   console.log('ERROR: ' + error)
// })

beforeAll(async () => {
  try {
    // establish connections to db/redis/etc
    connection = await mongoose.connect('mongodb://localhost/fashionscraper_test', { useNewUrlParser: true });
    client =  redis.createClient();

    // create assets
    product = await new ProductModel(ProductFactory.build()).save();
    user = await new UserModel(UserFactory.build()).save();

    watch1 = await new WatchModel(WatchFactory.build({ productId: product._id, userId: user._id, targetPrice: 40 })).save();
    watch2 = await new WatchModel(WatchFactory.build({ productId: product._id, userId: user._id, targetPrice: 60 })).save();

    price1 = await new PriceModel(PriceFactory.build({ productId: product._id, price: 75, })).save();
    price2 = await new PriceModel(PriceFactory.build({ productId: product._id, price: 55, date: new Date('April 15, 2020') })).save();

    const check1 = { productId: price1.productId, price: price1.price, }; // add to Redis queue
    const check2 = { productId: price2.productId, price: price2.price, }; // add to Redis queue
    await client.rpush('priceChecks', JSON.stringify(check1));
    await client.rpush('priceChecks', JSON.stringify(check2));

  } catch (err) {
    console.log('error: ' + err)
  }
})

afterAll(async () => {
  try {
    // cleanup assets
    await ProductModel.remove({});
    await UserModel.remove({});
    await WatchModel.remove({});
    await PriceModel.remove({}); 
    await client.del('priceChecks');
    
    // close connections to db/redis/etc
    await mongoose.disconnect();
    await client.quit();
  } catch (err) {
    console.log('error: ' + err)
  }
})

test('test jest', () => {
  expect(true).toBe(true);
})

// ensure setup is working properly
test('test connection and verify assets', async () => {
  expect(product.color).toBe('Mountain Blue');
  expect(user.role).toBe('user');

  expect(watch1.targetPrice).toBe(40);
  expect(watch2.targetPrice).toBe(60);

  const count = await ProductModel.count({});
  expect(count).toBe(1);

  const users = await UserModel.find({}).limit(1).exec();
  expect(users[0].watchlist.length).toBe(2);

  const numberOfChecks = await client.llen('priceChecks');
  expect(numberOfChecks).toBe(2);
});

// now test features

// PASSING
test('checkWatchlists', async () => {
  await checkWatchlists(client);

  const l = await client.llen('emailNotifications');

  expect(l).toBe(1);
});


// PASSING
// test('sendEmailNotification', async () => {
//   const res = await priceDropEmailer({
//     userName: 'Nick',
//     vendorUrl: 'https://bananarepublic.gapcanada.ca/browse/product.do?pid=473206033&cid=1014857&pcid=1014757', 
//   });

//   expect(res.accepted.length).toBe(1);
// })



