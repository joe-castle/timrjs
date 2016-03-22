'use strict';

/**
 * @description Checks the provided time for correct formatting.
 *
 * @param {String} time - The provided time string.
 * @returns {Boolean} True if format is incorrect, false otherwise.
 */

module.exports = (time) => (
  time.split(':')
    .some((e, i, a) => (
      +e < 0 || +e > (a.length === 3 && i === 0 ? 23 : 59) || isNaN(+e)
    ))
);
