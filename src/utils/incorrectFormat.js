/**
 * @description Checks the provided time for correct formatting.
 * See incorrectFormat-test.js for examples of correct and incorrect formatting.
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

  return time.length > 3 || time.some(
    el => isNaN(Number(el)) || Number(el) < 0
  );
};
