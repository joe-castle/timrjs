'use strict';

const gulp = require('gulp');
const wrap = require('gulp-wrap');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const browserify = require('browserify');

const version = require('./package.json').version;

const minCom = `/* TimrJS v${version} | (c) 2016 Joe Smith | https://github.com/joesmith100/timrjs/blob/master/LICENSE */
;<%= contents %>`

const funcWrapper = `/**
 * TimrJS v${version}
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers and NodeJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */

;window.Timr = (function() {
  return <%= contents %>
}())(6);`

gulp.task('default', () => (
  browserify('./lib/init.js')
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('timr.js'))
    .pipe(buffer())
    .pipe(wrap(funcWrapper))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify({compress: {negate_iife: false}}))
    .pipe(wrap(minCom))
    .pipe(rename('timr.min.js'))
    .pipe(gulp.dest('./dist/'))
));
