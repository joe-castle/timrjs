'use strict';

/**
 * @description
 * Pads out single digit numbers with a 0 at the beginning.
 * Primarly used for time units - 00:00:00.
 *
 * @param {Number} num - Number to be padded.
 * @returns {String} A 0 padded string or the the original
 * number as a string.
 */

module.exports = (num) => (
  num < 10 ? `0${num}` : `${num}`
)
