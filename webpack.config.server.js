
const webpack = require('webpack');
const path = require('path');

const NodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(env) {

  const envVariables = {
    'process.env': {
      'NODE_ENV': JSON.stringify(env.env),
      'NODE_MODE': JSON.stringify(env.mode),
    }
  }

  const plugins = [
    //new webpack.DefinePlugin(envVariables),
    new CopyWebpackPlugin([
      {from: 'src/favicon.ico'},
    ]), 
  ];

  const config = {
    context: path.resolve(__dirname),
    mode: env.env,
    target: 'node',
    devtool: 'source-map',
    node: {
      __dirname: true,
      __filename: true,
    },
    externals: NodeExternals(), // purpose ???
    entry: {
      server: [
        path.resolve(__dirname, 'polyfills'),
        path.join(__dirname, 'src/server/app.js'),
      ]
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    resolve: {
      modules: ['./node_modules', './src'],
      extensions: ['*', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              /*options: {
                plugins: [
                  [ 
                    "css-modules-transform", {
                      "preprocessCss": "./config/sassPreprocessor.js",
                      "extensions": [".css", ".scss"]
                    }
                  ],
                ],
              },*/
            },
          ]
        },
        {
          test: /\.(css|scss)$/,
          exclude: /node_modules/,
          use: [
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jp(e)?g|svg|gif)$/i,
          loader: 'url-loader?limit=10000',
        },
        {
          test: /\.(json)$/,
          loader: 'json-loader'
        }
      ]
    },
    plugins,
  };

  return config;
}

//"generateScopedName": "[hash:64]",