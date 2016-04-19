'use strict';

const Timr = require('./Timr');
const {
  add,
  getAll,
  startAll,
  pauseAll,
  stopAll,
  isRunning,
  removeFromStore,
  destroyAll
} = require('./store');

const init = Object.assign(
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

    if (options) {
      if (options.store) {
        return add(timr);
      }
      if (options.store === false) {
        return timr;
      }
    }

    if (init.store) {
      return add(timr);
    }

    return timr;
  },

  // Exposed helper methods.
  {
    validate: require('./validate'),
    formatTime: require('./utils/formatTime'),
    timeToSeconds: require('./utils/timeToSeconds'),
    incorrectFormat: require('./utils/incorrectFormat')
  },

  // Option to enable storing timrs, defaults to false.
  {store: false},

  // Methods for all stored timrs.
  {
    getAll,
    startAll,
    pauseAll,
    stopAll,
    isRunning,
    removeFromStore,
    destroyAll
  }
);

module.exports = init;
