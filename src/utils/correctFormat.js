/**
 * @description Checks the provided time for correct formatting.
 * See incorrectFormat-test.js for examples of correct and incorrect formatting.
 *
 * @param {String} time - The provided time string.
 *
 * @returns {Boolean} True if format is correct, false otherwise.
 */

module.exports = time => {
  if (typeof time === 'number') {
    return true;
  }

  if (typeof time !== 'string') {
    return false;
  }

  time = time.split(':');

  // No more than 3 units (hh:mm:ss) and every unit is a number and is not a negative number.
  return time.length <= 3 && time.every(el => !isNaN(Number(el)) && Number(el) >= 0);
};
