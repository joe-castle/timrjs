'use strict';

/**
 * @description Checks the provided time for correct formatting.
 *
 * @param {String} time - The provided time string.
 * @returns {Boolean} True if format is incorrect, false otherwise.
 */

module.exports = (time) => (
  time.split(':')
    .some((item, i, a) => {
      if (a.length === 3 && i === 0) {
        return +item < 0 || +item > 23 || isNaN(+item);
      }
      return +item < 0 || +item > 59 || isNaN(+item);
    })
);
