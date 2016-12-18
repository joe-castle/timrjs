var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import timeToSeconds from './timeToSeconds';

/**
 * @description Validates the startTime
 *
 * Additionally, if a pattern is provided, 25h / 25m, than
 * it is converted here before being passed to timeToSeconds.
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */
export default function validate(time) {
  var newTime = time;

  // Converts '25m' & '25h' into '25:00' & '25:00:00' respectivley.
  if (/^\d+[mh]$/i.test(newTime)) {
    newTime = newTime.replace(/^(\d+)m$/i, '$1:00');
    newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00');
  }

  if (typeof newTime !== 'string') {
    if (typeof newTime !== 'number' || isNaN(newTime) || newTime === Infinity || newTime === -Infinity) {
      throw new Error(
      // Passes correct type, including null, NaN and Infinity
      'Expected time to be a string or number, instead got: ' + (typeof newTime === 'number' || newTime === null ? newTime : typeof newTime === 'undefined' ? 'undefined' : _typeof(newTime)));
    }
  }

  if (typeof newTime === 'string' && isNaN(Number(newTime))) {
    if (!/^\d+$/.test(newTime) && !/^\d+:\d+$/.test(newTime) && !/^\d+:\d+:\d+$/.test(newTime)) {
      throw new Error('Expected time to be in (hh:mm:ss) format, instead got: ' + newTime);
    }
  }

  if (Number(newTime) < 0) {
    throw new Error('Time cannot be a negative number, got: ' + newTime);
  }

  return timeToSeconds(newTime);
}