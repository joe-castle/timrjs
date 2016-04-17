'use strict';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * @param {String|Number} time - The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @returns {Number} - The time in seconds.
 */
module.exports = (time) => (
  typeof time === 'number' && !isNaN(time) ? time : time.split(':')
    .reduce((prevItem, currentItem, index, arr) => {
      if (arr.length === 3) {
        if (index === 0) { return prevItem + +currentItem * 60 * 60; }
        if (index === 1) { return prevItem + +currentItem * 60; }
      }

      if (arr.length === 2) {
        if (index === 0) { return prevItem + +currentItem * 60; }
      }

      return prevItem + +currentItem;
    }, 0)
);
