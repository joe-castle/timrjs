'use strict';

const gulp = require('gulp');
const wrap = require('gulp-wrap');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const eslint = require('gulp-eslint');
const through2 = require('through2');
const browserify = require('browserify');
const friendlyFormatter = require('eslint-friendly-formatter');

const version = require('./package.json').version;

const prodErrors = `if (!DEBUG) {
  return new Error('Minified exception occured; use non-minified dev enviroment for full message.');
}`;

const minCom = `/* TimrJS v${version} | (c) 2016 Joe Smith | https://github.com/joesmith100/timrjs */
;<%= contents %>`;

const funcWrapper = `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, Node.js (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */

;(function(Timr) {
  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Timr;

  // RequireJS
  } else if (typeof define === "function" && define.amd) {
    // Name consistent with npm module
    define('timrjs', [], function() { return Timr; });

  // <script>
  } else {
    var global;
    if (typeof window !== "undefined") {
      global = window;
    } else if (typeof global !== "undefined") {
      global = global;
    } else if (typeof self !== "undefined") {
      global = self;
    } else {
      global = this;
    }
    global.Timr = Timr;
  }
})(<%= contents %>`;

const pipeFactory = (reg, rep) => (
  through2.obj((file, e, cb) => {
    file.contents = new Buffer(String(file.contents).trim().replace(reg, rep));
    cb(null, file);
  })
);

const removeFinalSemi = pipeFactory(/;$/, '');
const addFunctionCall = pipeFactory(/\[(\d)\]\)$/i, '$&($1));');
const addProdErrors = pipeFactory(
  'return function (error) {', `$&${prodErrors}`
);

gulp.task('lint', () => (
  gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format(friendlyFormatter))
    .pipe(eslint.failAfterError())
));

gulp.task('babel', () => (
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
));

gulp.task('default', ['lint', 'babel'], () => (
  browserify('./src/index.js')
    .transform('babelify')
    .bundle()
    .pipe(source('timr.js'))
    .pipe(buffer())
    .pipe(removeFinalSemi)
    .pipe(wrap(funcWrapper))
    .pipe(addFunctionCall)
    .pipe(gulp.dest('./dist/'))
    .pipe(addProdErrors)
    .pipe(uglify({compress: {negate_iife: false, global_defs: {DEBUG: false}}}))
    .on('error', gutil.log)
    .pipe(wrap(minCom))
    .pipe(rename('timr.min.js'))
    .pipe(gulp.dest('dist'))
));
