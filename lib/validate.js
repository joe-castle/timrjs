'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = validate;

var _timeToSeconds = require('./utils/timeToSeconds');

var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

var _correctFormat = require('./utils/correctFormat');

var _correctFormat2 = _interopRequireDefault(_correctFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description Validates the provded time
 *
 * Additionally, if a pattern is provided, 25h / 25m, than
 * it is converted here before being passed to timeToSeconds.
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format.
 * @throws If the provided time in seconds is over 999:59:59.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */
function validate(time) {
  if (/^\d+[mh]$/i.test(time)) {
    time = time.replace(/^(\d+)m$/i, '$1:00');
    time = time.replace(/^(\d+)h$/i, '$1:00:00');
  }

  if (!(!isNaN(time) && time !== Infinity && time !== -Infinity && typeof time === 'number' || typeof time === 'string')) {
    throw new Error('Expected time to be a string or number, instead got: ' + (
    // Passes correct type, including null, NaN and Infinity
    typeof time === 'number' || time === null ? time : typeof time === 'undefined' ? 'undefined' : _typeof(time)));
  }

  if (!(isNaN(Number(time)) || Number(time) >= 0)) {
    throw new Error('Time cannot be a negative number, got: ' + time);
  }

  if (!(0, _correctFormat2.default)(time)) {
    throw new Error('Expected time to be in (hh:mm:ss) format, instead got: ' + time);
  }

  if ((0, _timeToSeconds2.default)(time) > 3599999) {
    throw new Error('Sorry, we don\'t support any time over 999:59:59.');
  }

  return (0, _timeToSeconds2.default)(time);
}