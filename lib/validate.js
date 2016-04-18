'use strict';

/**
 * @description Validates the provded time
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time in seconds is over 23:59:59.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */

module.exports = (time) => {
  const errors = require('./utils/errors')(time);

  if (+time < 0) { throw errors('invalidTime');  }

  if (typeof time === 'string') {
    if (isNaN(+time) && require('./utils/incorrectFormat')(time)) {
      throw errors('invalidTime');
    }
  }

  else if (typeof time !== 'number' || isNaN(time)) {
    throw errors('invalidTimeType');
  }

  if (+time > 86399) {
    throw errors('timeOverADay');
  }

  return require('./utils/timeToSeconds')(time);
}
