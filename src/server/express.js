
import express from 'express';
import path from 'path';
import compression from 'compression';
//import favicon from 'serve-favicon';
import morgan from 'morgan';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';

import config from './config/environment';

export default function(app) {
  console.log('registering express');
  let env = app.get('env');

  app.set('views', path.resolve(config.root, 'src/server/views'));
  app.set('view engine', 'pug');
  app.use(compression());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(morgan('dev'));

  const cors = require('cors');
  const corsOptions ={
      origin:'http://localhost:3001', 
      credentials:true,            //access-control-allow-credentials:true
      optionSuccessStatus:200
  }
  app.use(cors(corsOptions));

  /*app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      db: 'passport'
    })
  }));*/

  app.set('appPath', path.resolve(config.root, 'dist')); 
  app.set('staticDir', path.resolve(config.root, 'src/server/public'));
  app.use(express.static(app.get('appPath'))); // serves static files from 'dist' dir 
  app.use(express.static(app.get('staticDir'))); // serves images from 'public dir'

  /*if(env === 'production') {
    app.use(favicon(path.resolve(config.root, 'dist/favicon.ico'))); 
  }*/

  if(env === 'development') {
    //app.use(favicon(path.resolve(config.root, 'src/favicon.ico'))); // should probably copy favicon to 'dist' and point to the copy in production
    app.use(errorHandler()); // must be last
  }

  console.log(`root --> ${path.resolve(config.root)}`);
  console.log(`appPath --> ${app.get('appPath')}`);
}
