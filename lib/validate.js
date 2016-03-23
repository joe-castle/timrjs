'use strict';

const incorrectFormat = require('./incorrectFormat');

/**
 * @description Validates the provded time
 *
 * @param {String|Number} time - The time to be checked

 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 *
 * @return The provided time if its valid.
 */

module.exports = (time) => {
  if (typeof time === 'string') {
    if (incorrectFormat(time)) {
      throw new Error(
        `Expected time format (HH:MM:SS, MM:SS or SS), instead got: ${time}`
      );
    }
  }

  else if (typeof time !== 'number') {
    throw new TypeError(
      `Expected time to be a string or number, instead got: ${typeof time}`
    );
  }

  return time;
}
