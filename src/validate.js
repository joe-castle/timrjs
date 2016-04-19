'use strict';

/**
 * @description Validates the provded time
 *
 * Additionally, if a pattern is provided, 25h / 25m, than
 * it is converted here before being passed to timeToSeconds.
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time in seconds is over 999:59:59.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */

module.exports = time => {
  const errors = require('./utils/errors')(time);

  if (Number(time) < 0) {
    throw errors('invalidTime');
  }

  if (Number(time) > 3599999) {
    throw errors('maxTime');
  }

  if (typeof time === 'string') {
    if (/^\d+[mh]$/i.test(time)) {
      time = time.replace(/^(\d+)m$/i, '$1:00');
      time = time.replace(/^(\d+)h$/i, '$1:00:00');
    }
    else if (isNaN(Number(time)) && require('./utils/incorrectFormat')(time)) {
      throw errors('invalidTime');
    }
  } else if (typeof time !== 'number' || isNaN(time)) {
    throw errors('invalidTimeType');
  }

  return require('./utils/timeToSeconds')(time);
};
