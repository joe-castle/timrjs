'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const incorrectFormat = require('./incorrectFormat');
const errors = require('./errors');

/**
 * @description Creates a new Timr object.
 *
 * @param {String} The starting time for the timr object.
 *
 * @throws {TypeError} Will throw an error if the provided
 * argument is not of type string or number.
 *
 * @throws Will throw an error if the provided argument is
 * incorrect format.
 *
 * @returns {Object} A new Timr object.
 */

module.exports = (startTime) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    if (incorrectFormat(startTime)) { throw errors.incorrectFormat; }
    return new Timr(timeToSeconds(startTime));
  }
  if (typeof startTime !== 'number') { throw errors.startTime; }
  return new Timr(startTime);
};
