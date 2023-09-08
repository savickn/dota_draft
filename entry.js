
if(process.env.NODE_ENV === 'scrape') {
  require('@babel/register')({
    ignore: [
      /logic/, // cuz Babels async transpilation doesn't work with Puppeteer
      /node_modules/
    ],
    plugins: [],
    presets: [
      "@babel/preset-env",
      "@babel/preset-react",
    ]
  });
  require('@babel/polyfill'); 
  require('./src/scripts/dota_scraper');
} else if(process.env.NODE_ENV === 'production') {
  console.log('serving from ./dist in production');
  //process.env.manifest = JSON.stringify(require('./dist/manifest.json'));
  require('./dist/server.bundle.js');
} else {
  console.log('registering babel');
  require('@babel/register')();
  require('@babel/polyfill'); //basically for generators
  console.log('starting server in dev mode')
  require('./src/server/app.js');
}

