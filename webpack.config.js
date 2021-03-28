const path = require('path')
const webpack = require('webpack')

const { version } = require('./package.json')

const banner = `/**
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

module.exports = [
  {
    name: 'commonjs',
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'lib'),
      filename: 'timr.js',
      library: {
        type: 'commonjs',
        name: 'Timr'
      }
    },
    mode: 'development',
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  },
  {
    name: 'es',
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'es'),
      filename: 'timr.js',
      library: {
        type: 'module'
      }
    },
    mode: 'development',
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    experiments: {
      outputModule: true
    }
  },
  {
    name: 'es-browsers',
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'es'),
      filename: 'timr.mjs',
      library: {
        type: 'module'
      }
    },
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    plugins: [new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    experiments: {
      outputModule: true
    }
  },
  {
    name: 'umd-dev',
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'timr.js',
      library: {
        type: 'umd2',
        name: 'Timr',
        umdNamedDefine: true
      }
    },
    mode: 'development',
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    plugins: [new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  },
  {
    name: 'umd-prod',
    entry: './src/index',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'timr.min.js',
      library: {
        type: 'umd2',
        name: 'Timr',
        umdNamedDefine: true
      }
    },
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    plugins: [new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
]
