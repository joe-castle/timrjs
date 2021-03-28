import path from 'path'
import webpack from 'webpack'
import { getIfUtils } from 'webpack-config-utils'

import { version } from './package.json'

export default (env, config) => {
  const { ifProduction } = getIfUtils(config.mode)

  const banner = ifProduction(
    `/* TimrJS v${version} | (c) ${new Date().getFullYear()} Joe Castle | https://github.com/joesmith100/timrjs | @license MIT */`,
    `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) ${new Date().getFullYear()} Joe Castle
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE.md
 */`
  )

  return {
    entry: './src/index',
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
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    plugins: [new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
}
