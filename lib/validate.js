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
  const errors = require('./errors')(time);

  if (typeof time === 'string') {
    if (+time < 0 || isNaN(+time) && incorrectFormat(time)) {
      throw errors('invalidTime');
    }
  }

  else if (typeof time !== 'number' || isNaN(time)) {
    throw errors('invalidTimeType');
  }

  if (+time > 86399) {
    throw errors('timeOverADay');
  }

  return time;
}
