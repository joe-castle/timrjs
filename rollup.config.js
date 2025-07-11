import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs";

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
    output: [
      {
        file: 'lib/timr.js',
        format: 'cjs',
        banner: devBanner
      },
      {
        file: 'es/timr.js',
        format: 'es',
        banner: devBanner
      },
      {
        file: 'dist/timr.js',
        format: 'umd',
        name: 'Timr',
        banner: devBanner
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'es/timr.mjs',
        format: 'es',
        banner: prodBanner
      },
      {
        file: 'dist/timr.min.js',
        format: 'umd',
        name: 'Timr',
        banner: prodBanner
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
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