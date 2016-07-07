'use strict';

const webpack = require('webpack');
const version = require('./package.json').version;

const env = process.env.NODE_ENV;
let bannerText = `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */`;

const config = {
  output: {
    library: 'Timr',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ],
  },
};

if (env === 'production') {
  bannerText = `/* TimrJS v${version} | (c) 2016 Joe Smith | https://github.com/joesmith100/timrjs */`;

  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

config.plugins.push(
  new webpack.BannerPlugin(bannerText, { raw: true })
);

module.exports = config;
