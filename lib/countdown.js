'use strict';
/**
 * @description Countdown function.
 * Bound to a setInterval timer when start() is called.
 *
 * @param {Object} self - Timr object.
 */
module.exports = (self) => {
  self.currentTime -= 1;

  self.emit(
    'ticker',
    self.formatTime(),
    self.percentDone(),
    self.currentTime,
    self.startTime,
    self
  );

  if (self.currentTime <= 0) {
    self.stop();
    self.emit('finish', self);
  }
}
