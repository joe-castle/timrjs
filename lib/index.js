'use strict';

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _formatTime = require('./formatTime');

var _formatTime2 = _interopRequireDefault(_formatTime);

var _timeToSeconds = require('./timeToSeconds');

var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

var _correctFormat = require('./correctFormat');

var _correctFormat2 = _interopRequireDefault(_correctFormat);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _Timr = require('./Timr');

var _Timr2 = _interopRequireDefault(_Timr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var add = _store2.default.add;
var getAll = _store2.default.getAll;
var startAll = _store2.default.startAll;
var pauseAll = _store2.default.pauseAll;
var stopAll = _store2.default.stopAll;
var isRunning = _store2.default.isRunning;
var removeFromStore = _store2.default.removeFromStore;
var destroyAll = _store2.default.destroyAll;


var init = (0, _objectAssign2.default)(
/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @return {Object} A new Timr object.
 */
function (startTime, options) {
  var timr = new _Timr2.default(startTime, options);

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
  validate: _validate2.default,
  formatTime: _formatTime2.default,
  timeToSeconds: _timeToSeconds2.default,
  correctFormat: _correctFormat2.default
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