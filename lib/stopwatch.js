'use strict';

/**
 * @description A stopwatch style counter.
 * Counts upwards, rather than down
 */
module.exports = (self) => {
  self.currentTime += 1;

  self.emit('ticker', self.formatTime(), self.currentTime);
}
