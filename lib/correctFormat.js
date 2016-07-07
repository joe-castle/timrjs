'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = correctFormat;
/**
 * @description Checks the provided time for correct formatting.
 * See incorrectFormat-test.js for examples of correct and incorrect formatting.
 *
 * @param {String} time - The provided time string.
 *
 * @returns {Boolean} True if format is correct, false otherwise.
 */

function correctFormat(time) {
  var newTime = time;

  if (typeof newTime === 'number') {
    return true;
  }

  if (typeof newTime !== 'string') {
    return false;
  }

  newTime = newTime.split(':');

  // No more than 3 units (hh:mm:ss) and every unit is a number and is not a negative number.
  return newTime.length <= 3 && newTime.every(function (el) {
    return !isNaN(Number(el)) && Number(el) >= 0;
  });
}