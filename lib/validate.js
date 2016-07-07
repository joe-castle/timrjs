'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = validate;

var _timeToSeconds = require('./timeToSeconds');

var _timeToSeconds2 = _interopRequireDefault(_timeToSeconds);

var _correctFormat = require('./correctFormat');

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
  var newTime = time;

  if (/^\d+[mh]$/i.test(newTime)) {
    newTime = newTime.replace(/^(\d+)m$/i, '$1:00');
    newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00');
  }

  if (!(!isNaN(newTime) && newTime !== Infinity && newTime !== -Infinity && typeof newTime === 'number' || typeof newTime === 'string')) {
    throw new Error('Expected time to be a string or number, instead got: ' + (
    // Passes correct type, including null, NaN and Infinity
    typeof newTime === 'number' || newTime === null ? newTime : typeof newTime === 'undefined' ? 'undefined' : _typeof(newTime)));
  }

  if (!(isNaN(Number(newTime)) || Number(newTime) >= 0)) {
    throw new Error('Time cannot be a negative number, got: ' + newTime);
  }

  if (!(0, _correctFormat2.default)(newTime)) {
    throw new Error('Expected time to be in (hh:mm:ss) format, instead got: ' + newTime);
  }

  if ((0, _timeToSeconds2.default)(newTime) > 3599999) {
    throw new Error('Sorry, we don\'t support any time over 999:59:59.');
  }

  return (0, _timeToSeconds2.default)(newTime);
}