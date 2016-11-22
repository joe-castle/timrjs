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

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _Timr = require('./Timr');

var _Timr2 = _interopRequireDefault(_Timr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return new _Timr2.default(startTime, options);
},

// Exposed helper methods.
{
  validate: _validate2.default,
  formatTime: _formatTime2.default,
  timeToSeconds: _timeToSeconds2.default,
  correctFormat: _correctFormat2.default,
  createStore: _createStore2.default
});

module.exports = init;