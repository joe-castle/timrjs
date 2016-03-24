'use strict';

const incorrectFormat = require('./incorrectFormat');

/**
 * @description Validates the provded time
 *
 * @param {String|Number} time - The time to be checked

 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time in seconds is over 23:59:59.
 *
 * @return The provided time if its valid.
 */

module.exports = (time) => {
  if (typeof time === 'string') {
    if (+time < 0 || isNaN(+time) && incorrectFormat(time)) {
      throw new Error(
        `Expected time format (HH:MM:SS, MM:SS or SS), instead got: ${time}`
      );
    }
  }

  else if (typeof time !== 'number' || isNaN(time)) {
    throw new TypeError(
      `Expected time to be a string or number, instead got: ${
        typeof time === 'number' ? time : typeof time
      }`
    );
  }

  if (+time > 86399) {
    throw new Error(
      'Sorry, we don\'t support any time over 23:59:59 at the moment.'
    )
  }

  return time;
}
