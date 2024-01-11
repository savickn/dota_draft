

import Express from 'express';
import mongoose from 'mongoose';

import config from './config/environment';

const app = new Express();

/* 
** HMR Setup
*/

if (process.env.NODE_ENV === 'development') {
  console.log('using webpack-dev-middleware');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');

  const isSSR = process.env.NODE_MODE === 'SSR';
  const wENV = {
    analyze: false,
    mode: isSSR ? 'SSR' : 'SPA',
    env: process.env.NODE_ENV
  };
  const webpackConfig = require('../../webpack.config.client')(wENV);
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    writeToDisk: true,
    //serverSideRender: isSSR,
  }));
  app.use(webpackHotMiddleware(compiler));
}

console.log(`node_mode --> ${process.env.NODE_MODE}`);
console.log(`node_env --> ${process.env.NODE_ENV}`);
console.log(`mongo --> ${config.mongo.uri}`);

/*
** Mongoose Setup
*/

mongoose.Promise = global.Promise;

mongoose.connect(config.mongo.uri)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      throw error;
    })

require('./express').default(app);
require('./routes').default(app);

app.listen(config.port, (error) => {
  if(!error) {
    console.log(`Express is running on port ${config.port}`);
  }
});

export default app;







