import objectAssign from 'object-assign';

import validateStartTime from './validateStartTime';
import formatTime from './formatTime';
import timeToSeconds from './timeToSeconds';
import correctFormat from './correctFormat';
import createStore from './createStore';

import Timr from './Timr';

const init = objectAssign(
  /**
   * @description Creates a new Timr object.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @return {Object} A new Timr object.
   */
  (startTime, options) => new Timr(startTime, options),

  // Exposed helper methods.
  {
    validateStartTime,
    formatTime,
    timeToSeconds,
    correctFormat,
    createStore,
  }
);

module.exports = init;
