'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatTime;
/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {String} separator - The character used to separate the time units.
 * @param {String} outputFormat - The way the time is displayed.
 * @param {String} formatType - The way in which the time string is created.
 *
 * @return {String} The formatted time.
 */
function formatTime(seconds) {
  var separator = arguments.length <= 1 || arguments[1] === undefined ? ':' : arguments[1];
  var outputFormat = arguments.length <= 2 || arguments[2] === undefined ? 'mm:ss' : arguments[2];
  var formatType = arguments.length <= 3 || arguments[3] === undefined ? 'h' : arguments[3];

  /**
   * @description Creates a timestring.
   * Created inside formatTime to have access to its arguments,
   *
   * @param {Array} [...args] - All arguments to be processed
   *
   * @return {String} The compiled time string.
   */
  function createTimeString() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.filter(function (value) {
      return value !== false;
    }).map(function (value) {
      return value < 10 ? '0' + value : value;
    }).join(separator);
  }

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