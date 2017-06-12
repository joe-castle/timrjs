import formatTime from './formatTime';
import timeToSeconds from './timeToSeconds';
import dateToSeconds from './dateToSeconds';
import createStore from './createStore';
import zeroPad from './zeroPad';

import Timr from './Timr';

  /**
   * @description Creates a new Timr object.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @return {Object} A new Timr object.
   */
function create(startTime, options) {
  return new Timr(startTime, options);
}

export {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad,
};
