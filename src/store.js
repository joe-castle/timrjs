export default (function store() {
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
     * @param {Object} timr - A timr object.
     *
     * @return {Object} The provided timr object.
     */
    add: timr => {
      if (timrs.indexOf(timr) === -1) {
        timrs.push(timr);
      }

      return timr;
    },

    // Methods associated with all Timrs.
    getAll: () => timrs,
    startAll: () => timrs.forEach(timr => timr.start()),
    pauseAll: () => timrs.forEach(timr => timr.pause()),
    stopAll: () => timrs.forEach(timr => timr.stop()),
    isRunning: () => timrs.filter(timr => timr.isRunning()),
    removeFromStore: timr => {
      timrs = timrs.filter(x => x !== timr);
    },
    destroyAll: () => {
      timrs.forEach(timr => timr.destroy());
      timrs = [];
    },
  };
}());
