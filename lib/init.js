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
      return store(timr);
    }
    if (options.store === false) {
      return timr;
    }
  }

  if (init.store) {
    return store(timr);
  }

  return timr;
};

// Exposed helper methods.
init.validate = require('./validate');
init.timeToSeconds = require('./timeToSeconds');
init.incorrectFormat = require('./incorrectFormat');

// Option to enable storing timrs, defaults to false.
init.store = false;

// Methods for all stored timrs.
init.destroyAll = store.destroyAll;
init.isRunning = store.isRunning;
init.startAll = store.startAll;
init.pauseAll = store.pauseAll;
init.stopAll = store.stopAll;

module.exports = init;
