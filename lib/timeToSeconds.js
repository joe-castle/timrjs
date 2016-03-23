'use strict';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * @param {String} time - The time to be converted.
 *
 * @returns {Number} The converted time in seconds.
 */

module.exports = (time) => (
  time.split(':')
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
)
