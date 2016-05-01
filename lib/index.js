'use strict';

require('./polyfills');

var Timr = require('./Timr');

var _require = require('./store');

var add = _require.add;
var getAll = _require.getAll;
var startAll = _require.startAll;
var pauseAll = _require.pauseAll;
var stopAll = _require.stopAll;
var isRunning = _require.isRunning;
var removeFromStore = _require.removeFromStore;
var destroyAll = _require.destroyAll;


var init = Object.assign(
/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @return {Object} A new Timr object.
 */
function (startTime, options) {
  var timr = new Timr(startTime, options);

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
  validate: require('./validate'),
  formatTime: require('./utils/formatTime'),
  timeToSeconds: require('./utils/timeToSeconds'),
  incorrectFormat: require('./utils/incorrectFormat')
},

// Methods for all stored timrs.
{
  add: add,
  getAll: getAll,
  startAll: startAll,
  pauseAll: pauseAll,
  stopAll: stopAll,
  isRunning: isRunning,
  removeFromStore: removeFromStore,
  destroyAll: destroyAll
});

module.exports = init;