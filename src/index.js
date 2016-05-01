'use strict';

require('./polyfills');

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
  {store: false},

  // Exposed helper methods.
  {
    validate: require('./validate'),
    formatTime: require('./utils/formatTime'),
    timeToSeconds: require('./utils/timeToSeconds'),
    incorrectFormat: require('./utils/incorrectFormat')
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
    destroyAll
  }
);

module.exports = init;
