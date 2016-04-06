'use strict';

// Array to store all timrs.
let timrs = [];

/**
 * @description A function that stores all timr objects created.
 * This feature is disabled by default, Timr.store = true to enable.
 *
 * Can also be disabled/enabled on an individual basis.
 * Each timr object accepts store as an option, true or false.
 * This overides the globabl Timr.store option.
 *
 * @param {Object} A timr object.
 * @returns {Object} The provided timr object.
 */
const store = (timr) => {
  timrs.push(timr);

  return timr;
};

// Methods associated with all timrs.
store.startAll = () => timrs.forEach(timr => timr.start());

store.pauseAll = () => timrs.forEach(timr => timr.pause());

store.stopAll = () => timrs.forEach(timr => timr.stop());

store.getAll = () => timrs;

store.isRunning = () => timrs.filter(timr => timr.isRunning());

store.destroyAll = () => {
  timrs.forEach(timr => timr.destroy());
  timrs = [];
}

store.removeFromStore = (timr) => {
  timrs = timrs.filter(x => x !== timr)
}

module.exports = store;
