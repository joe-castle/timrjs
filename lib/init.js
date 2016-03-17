'use strict';

const Timr = require('./Timr');

/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @returns {Object} A new Timr object.
 */

// module.exports =
const init = (startTime, options) => (
  new Timr(startTime, options)
);

init('24:10:00').start().ticker(ct => console.log(ct));
