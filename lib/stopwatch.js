'use strict';

/**
 * @description Stopwatch function.
 * Bound to a setInterval timer when start() is called.
 *
 * @param {Object} self - Timr object.
 */
module.exports = (self) => {
  self.currentTime += 1;

  self.emit('ticker', self.formatTime(), self.currentTime);
}
