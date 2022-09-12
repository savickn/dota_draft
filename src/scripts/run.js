require('@babel/register')({
  ignore: [
    /logic/, // cuz Babels async transpilation doesn't work with Puppeteer
    /node_modules/
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-dynamic-import"
  ],
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
  ]
});
require('@babel/polyfill'); 

require('./setup');