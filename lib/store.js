'use strict';

module.exports = (function() {
  // Array to store all timrs.
  let timrs = [];

  return {
    /**
     * @description A function that stores all timr objects created.
     * This feature is disabled by default, Timr.store = true to enable.
     *
     * Can also be disabled/enabled on an individual basis.
     * Each timr object accepts store as an option, true or false.
     * This overides the global Timr.store option.
     *
     * @param {Object} A timr object.
     *
     * @returns {Object} The provided timr object.
     */
    add: (timr) => (timrs.push(timr), timr),

    // Methods associated with all Timrs.
    getAll: () => timrs,
    startAll: () => timrs.forEach(timr => timr.start()),
    pauseAll: () => timrs.forEach(timr => timr.pause()),
    stopAll: () => timrs.forEach(timr => timr.stop()),
    isRunning: () => timrs.filter(timr => timr.isRunning()),
    destroyAll: () => {
      timrs.forEach(timr => timr.destroy());
      timrs = [];
    },
    removeFromStore: (timr) => {
      timrs = timrs.filter(x => x !== timr)
    },
  }
}());
