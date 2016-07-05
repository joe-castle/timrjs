'use strict';

var errors = require('./utils/errors');
var timeToSeconds = require('./utils/timeToSeconds');
var incorrectFormat = require('./utils/incorrectFormat');

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

module.exports = function (time) {
  var error = errors(time);

  if (Number(time) < 0) {
    throw error('invalidTime');
  }

  if (Number(time) > 3599999) {
    throw error('maxTime');
  }

  if (typeof time === 'string') {
    if (/^\d+[mh]$/i.test(time)) {
      time = time.replace(/^(\d+)m$/i, '$1:00');
      time = time.replace(/^(\d+)h$/i, '$1:00:00');
    } else if (isNaN(Number(time)) && incorrectFormat(time)) {
      throw error('invalidTime');
    }
  } else if (typeof time !== 'number' || isNaN(time)) {
    throw error('invalidTimeType');
  }

  return timeToSeconds(time);
};