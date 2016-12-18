import objectAssign from 'object-assign';

import validateStartTime from './validateStartTime';
import formatTime from './formatTime';
import timeToSeconds from './timeToSeconds';
import createStore from './createStore';

import Timr from './Timr';

var init = objectAssign(
/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @return {Object} A new Timr object.
 */
function (startTime, options) {
  return new Timr(startTime, options);
},

// Exposed helper methods.
{
  validateStartTime: validateStartTime,
  formatTime: formatTime,
  timeToSeconds: timeToSeconds,
  createStore: createStore
});

module.exports = init;