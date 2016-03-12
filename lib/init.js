'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const buildOptions = require('./buildOptions');
const incorrectFormat = require('./incorrectFormat');
const errors = require('./errors');

/**
 * @description Creates a new Timr object.
 *
 * @param {String} [startTime=0] The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @throws {TypeError} Will throw an error if the provided
 * argument is not of type string or number.
 *
 * @throws Will throw an error if provided option doesn't
 * meet criteria.
 *
 * @throws Will throw an error if the provided startTime is
 * incorrect format.
 *
 * @returns {Object} A new Timr object.
 */

module.exports = (startTime, options) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    if (incorrectFormat(startTime)) {
      throw errors(startTime).incorrectFormat;
    }
    return new Timr(timeToSeconds(startTime), buildOptions(options));
  }
  if (typeof startTime !== 'number') {
    throw errors(typeof startTime).startTime;
  }
  return new Timr(startTime, buildOptions(options));
};
