
const webpack = require('webpack');
const path = require('path');

//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlHardDiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//const ManifestPlugin = require('webpack-manifest-plugin');
//const LoadablePlugin = require('@loadable/webpack-plugin');

const loaders = require('./webpack.loaders');

/*
** Loaders for production build
*/

const prodRules = [
  loaders.babelLoader,
  {
    test: /\.(css|scss|sass)$/,
    include: /\.global/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      loaders.cssLoaderForGlobals,
      loaders.postcssLoader,
      'sass-loader',
    ]
  }, 
  {
    test: /\.(css|scss|sass)$/,
    exclude: /\.global/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      loaders.cssLoaderForModules,
      loaders.postcssLoader,
      'sass-loader',
    ]
  }, 
  loaders.urlLoader, 
  loaders.jsonLoader, 
  loaders.fileLoader, 
];

/*
** Loaders for dev build
*/

const devRules = [
  loaders.babelLoader,
  {
    test: /\.(css|scss|sass)$/,
    include: /\.global/,
    use: [
      'style-loader',
      loaders.cssLoaderForGlobals,
      loaders.postcssLoader,
      'sass-loader',
    ]
  }, 
  {
    test: /\.(css|scss|sass)$/,
    exclude: /\.global/,
    use: [
      'style-loader',
      loaders.cssLoaderForModules,
      loaders.postcssLoader,
      'sass-loader',
    ]
  }, 
  loaders.urlLoader, 
  loaders.jsonLoader, 
  loaders.fileLoader, 
];

/*
** webpack config
*/

module.exports = function(env) {
  console.log('Webpack ENV Variables --> ', env);

  var plugins = [];

  if(env.env === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if(env.env === 'production') {
    plugins.push(new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].[chunkhash].css"
    }));
  }

  //if(env.mode === 'SPA') {
    plugins.push(new HtmlWebpackPlugin({
      template: './src/client/template.html',
      filename: 'index.html',
      alwaysWriteToDisk: true,
    }));
    plugins.push(new HtmlHardDiskPlugin());
  //}

  plugins.push(new webpack.ProvidePlugin({
    process: 'process/browser',
  }));

  /*if(env.mode === 'SSR') {
    plugins.push(new ManifestPlugin());
    plugins.push(new LoadablePlugin());
  }*/
  
  /*if(env.mode === 'analyze') {
    plugins.push(new BundleAnalyzerPlugin());
  };*/
  
  const config = {
    context: path.resolve(__dirname),
    mode: env.env, 
    target: 'web', 
    devtool: 'source-map', 
    entry: {
      //polyfills: path.resolve(__dirname, 'polyfills.js'),
      app: [
        path.resolve(__dirname, 'polyfills.js'),
        path.resolve(__dirname, 'src/client/index.js'),
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].bundle.js',
      chunkFilename: '[name].[chunkhash].js',
    },
    resolve: {
      modules: [
        './node_modules',
        './src',
      ],
      extensions: ['*', '.js', '.jsx'],
      fallback: {
        "path": require.resolve("path-browserify")
      },
    },
    plugins,
  };

  if(env.env === 'development') {
    // adds support for HMR
    config.entry.app.unshift("webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
    config.entry.app.unshift('react-hot-loader/patch');

    config.module = {
      rules: devRules, 
    };

    // adds support for global CSS
    /*config.module.rules.unshift({
      test: /\.(css|scss|sass)$/,
      include: /(\.global)/,
      use: [
        'style-loader',
        cssLoaderForGlobals,
        postcssLoader,
        'sass-loader?sourceMap=true',
      ]
    })

    // adds support for CSS modules
    config.module.rules.unshift({
      test: /\.(css|scss|sass)$/,
      exclude: /(\.global)/,
      use: [
        'style-loader',
        cssLoaderForModules,
        postcssLoader,
        'sass-loader?sourceMap=true',
      ]
    })*/
  }

  if(env.env === 'production') {
    config.optimization = {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendors: false,
          defaults: false,
          vendor: {
            name: 'vendor', 
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      },
      noEmitOnErrors: true,
      nodeEnv: 'production'
    };

    // used to server from CDN in production mode
    //config.output.publicPath = 'https://cdnName.com'

    config.module = {
      rules: prodRules, 
    };

    // for global CSS
    /*config.module.rules.unshift({
      test: /\.(css|scss|sass)$/,
      include: /(\.global)/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        cssLoaderForGlobals,
        postcssLoader,
        'sass-loader?sourceMap=true',
      ]
    })*/

    // for CSS modules
    /*config.module.rules.unshift({
      test: /\.(css|scss|sass)$/,
      exclude: /(\.global)/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        cssLoaderForModules,
        postcssLoader,
        'sass-loader?sourceMap=true',
      ]
    })*/
  }

  return config;
}
