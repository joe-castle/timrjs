'use strict';

const Timr = require('./Timr');
const validate = require('./validate');

/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @returns {Object} A new Timr object.
 */

const init = (startTime, options) => (
  new Timr(startTime, options)
);

init.validate = validate;

// init(60).ticker((ft, pd, ct, st, self) => {
//   console.log('Formatted time:', ft, 'Percent Done:', pd, 'Current Time:', ct, 'Start Time:', st);
// }).start();

module.exports = init;
