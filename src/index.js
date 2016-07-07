import objectAssign from 'object-assign';

import validate from './validate';
import formatTime from './formatTime';
import timeToSeconds from './timeToSeconds';
import correctFormat from './correctFormat';
import store from './store';

import Timr from './Timr';

const {
  add,
  getAll,
  startAll,
  pauseAll,
  stopAll,
  isRunning,
  removeFromStore,
  destroyAll,
} = store;

const init = objectAssign(
  /**
   * @description Creates a new Timr object.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @return {Object} A new Timr object.
   */
  (startTime, options) => {
    const timr = new Timr(startTime, options);

    // Stores timr if options.store is true. Overrides global setting.
    if (options) {
      if (options.store) {
        return add(timr);
      }
      if (options.store === false) {
        return timr;
      }
    }

    // Stores timr if global setting is true.
    if (init.store) {
      return add(timr);
    }

    return timr;
  },

  // Option to enable storing timrs, defaults to false.
  { store: false },

  // Exposed helper methods.
  {
    validate,
    formatTime,
    timeToSeconds,
    correctFormat,
  },

  // Methods for all stored timrs.
  {
    add,
    getAll,
    startAll,
    pauseAll,
    stopAll,
    isRunning,
    removeFromStore,
    destroyAll,
  }
);

module.exports = init;
