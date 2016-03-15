'use strict';
/**
 * @description The main Timr function for counting down.
 * Bound to a setInterval timer when start() is called.
 */
module.exports = (self) => {
  self.currentTime -= 1;

  self.emit('ticker', self.formatTime(), self.currentTime, self.startTime);

  if (self.currentTime <= 0) {
    self.emit('finish');
    self.stop();
  }
}
