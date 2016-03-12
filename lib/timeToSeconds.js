'use strict';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 * 
 * @param {String} The time to be converted.
 * @returns {Number} The converted time in seconds.
 */

module.exports = (time) => (
  time.split(':')
    .map((item, index, arr) => {
      if (arr.length === 1) { return +item; }
      if (arr.length === 2) {
        if (index === 0) { return +item * 60; }
        return +item;
      }
      if (arr.length === 3) {
        if (index === 0) { return +item * 60 * 60; }
        if (index === 1) { return +item * 60; }
        return +item
      }
    })
    .reduce((a, b) => a+b, 0)
)
