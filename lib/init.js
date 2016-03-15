'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const buildOptions = require('./buildOptions');
const incorrectFormat = require('./incorrectFormat');

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

// module.exports
const init = (startTime, options) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    if (incorrectFormat(startTime)) {
      throw new Error(
        `Warning! Provided time is not in the correct format. Expected time format (HH:MM:SS, MM:SS or SS), instead got: ${startTime}`
      );
    }
    return new Timr(timeToSeconds(startTime), buildOptions(options));
  }
  if (typeof startTime !== 'number') {
    throw new TypeError(
      `Warning! Expected starting time to be a number, instead got a(n): ${typeof startTime}`
    );
  }
  return new Timr(startTime, buildOptions(options));
};

init(600).start().ticker(ct => console.log(ct));
