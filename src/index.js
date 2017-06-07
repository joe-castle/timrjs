import objectAssign from 'object-assign';

import formatTime from './formatTime';
import timeToSeconds from './timeToSeconds';
import createStore from './createStore';
import zeroPad from './zeroPad';

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
    zeroPad,
    formatTime,
    timeToSeconds,
    createStore,
  },
);

export default init;
