'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatTime;

var _buildOptions2 = require('./buildOptions');

var _buildOptions3 = _interopRequireDefault(_buildOptions2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {Object} [options] - The options to build the string.
 *
 * @return {String} The formatted time.
 */
function formatTime(seconds, options) {
  var _buildOptions = (0, _buildOptions3.default)(options);

  var outputFormat = _buildOptions.outputFormat;
  var formatType = _buildOptions.formatType;
  var separator = _buildOptions.separator;

  /**
   * @description Creates a timestring.
   * Created inside formatTime to have access to separator argument,
   *
   * @param {Array} [...args] - All arguments to be processed
   *
   * @return {String} The compiled time string.
   */

  var createTimeString = function createTimeString() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.filter(function (value) {
      return value !== false;
    }).map(function (value) {
      return value < 10 ? '0' + value : value;
    }).join(separator);
  };

  if (formatType === 's') {
    return '' + seconds;
  }

  var minutes = seconds / 60;

  if (minutes >= 1 && /[hm]/i.test(formatType)) {
    var hours = minutes / 60;
    minutes = Math.floor(minutes);

    if (hours >= 1 && /[h]/i.test(formatType)) {
      hours = Math.floor(hours);

      return createTimeString(hours, minutes - hours * 60, seconds - minutes * 60);
    }

    return createTimeString(/HH:MM:SS/i.test(outputFormat) && 0, minutes, seconds - minutes * 60);
  }

  return createTimeString(/HH:MM:SS/i.test(outputFormat) && 0, /MM:SS/i.test(outputFormat) && 0, seconds);
}