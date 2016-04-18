'use strict';

/**
 * @description Checks the provided time for correct formatting.
 *
 * @param {String} time - The provided time string.
 *
 * @returns {Boolean} True if format is incorrect, false otherwise.
 */

module.exports = time => {
  if (typeof time !== 'string') {
    return true;
  }

  time = time.split(':');

  return time.length > 3 || time.some((el, i, arr) => (
    isNaN(Number(el)) ||
    Number(el) < 0 ||
    Number(el) > (arr.length === 3 && i === 0 ? 999 : 59)
  ));
};
