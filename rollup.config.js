import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
const version = process.env.RELEASE_VERSION

const devBanner = `/**
* TimrJS v${version}
* https://github.com/joe-castle/timrjs
* https://www.npmjs.com/package/timrjs
*
* Compatible with Browsers and Node.js (CommonJS).
*
* Copyright (c) ${new Date().getFullYear()} Joe Castle
* Released under the MIT license
* https://github.com/joe-castle/timrjs/blob/master/LICENSE.md
*/`

const prodBanner = `/* TimrJS v${version} | (c) ${new Date().getFullYear()} Joe Castle | https://github.com/joe-castle/timrjs */`

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/timr.js',
      format: 'cjs',
      banner: devBanner
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/timr.js',
      format: 'es',
      banner: devBanner
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/timr.mjs',
      format: 'es',
      banner: prodBanner
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      terser({
        format: {
          comments: /TimrJS/g
        },
        compress: {
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/timr.js',
      format: 'umd',
      name: 'Timr',
      banner: devBanner
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/timr.min.js',
      format: 'umd',
      name: 'Timr',
      banner: prodBanner,
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      terser({
        format: {
          comments: /TimrJS v\d+\.\d+\.\d+/g
        },
        compress: {
          unsafe: true,
          unsafe_comps: true
        }
      })
    ]
  }
]