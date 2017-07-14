import path from 'path'
import webpack from 'webpack'
import { getIfUtils, removeEmpty } from 'webpack-config-utils'

import { version } from './package.json'

export default (env) => {
  const { ifProduction } = getIfUtils(env)

  const banner = ifProduction(
    `/* TimrJS v${version} | (c) 2016 Joe Smith | https://github.com/joesmith100/timrjs */`,
    `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE.md
 */`
  )

  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: ifProduction(
        'timr.min.js',
        'timr.js'
      ),
      library: 'Timr',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    plugins: removeEmpty([
      ifProduction(
        new webpack.optimize.UglifyJsPlugin()
      ),
      new webpack.BannerPlugin({ banner, raw: true }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ]),
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              // Enables webpack tree-shaking
              babelrc: false,
              presets: [['latest', { es2015: { modules: false } }]],
              plugins: ['transform-object-rest-spread']
            }
          },
          exclude: /node_modules/
        }
      ]
    }
  }
}
