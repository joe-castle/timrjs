'use strict';

const Timr = require('./Timr');
const store = require('./store');

/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @returns {Object} A new Timr object.
 */

const init = (startTime, options) => {
  const timr = new Timr(startTime, options);

  if (options) {
    if (options.store) {
      return store.add(timr);
    }
    if (options.store === false) {
      return timr;
    }
  }

  if (init.store) {
    return store.add(timr);
  }

  return timr;
};

// Exposed helper methods.
init.validate = require('./validate');
init.formatTime = require('./utils/formatTime');
init.timeToSeconds = require('./utils/timeToSeconds');
init.incorrectFormat = require('./utils/incorrectFormat');

// Option to enable storing timrs, defaults to false.
init.store = false;

// Methods for all stored timrs.
init.startAll = store.startAll;
init.pauseAll = store.pauseAll;
init.stopAll = store.stopAll;
init.getAll = store.getAll;
init.isRunning = store.isRunning;
init.destroyAll = store.destroyAll;
init.removeFromStore = store.removeFromStore;

module.exports = init;
