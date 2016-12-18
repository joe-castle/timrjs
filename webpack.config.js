'use strict';

const webpack = require('webpack');
const version = require('./package.json').version;

const config = {
  output: {
    library: 'Timr',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [],
  module: {
    rules: [{ 
      test: /\.js$/, 
      use: [{ 
        loader: 'babel-loader', 
        options: {
          babelrc: false,
          presets: ['es2015'],
        },
      }],
      exclude: /node_modules/ 
    }],
  },
};

let bannerText = `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE.md
 */`;

if (process.env.NODE_ENV === 'production') {
  bannerText = `/* TimrJS v${version} | (c) 2016 Joe Smith | https://github.com/joesmith100/timrjs */`;

  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

config.plugins.push(
  new webpack.BannerPlugin({ banner: bannerText, raw: true })
);

module.exports = config;
