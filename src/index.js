import formatTime from './formatTime'
import timeToSeconds from './timeToSeconds'
import dateToSeconds from './dateToSeconds'
import createStore from './createStore'
import zeroPad from './zeroPad'

import Timr from './Timr'
import { isObj, exists } from './validate'

  /**
   * @description Creates a new Timr object.
   *
   * @param {String|Number|Object} startTime - The starting time for the timr object.
   * Or an object with startTime and optinos.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @return {Object} A new Timr object.
   */
function create (startTime, options) {
  if (isObj(startTime)) {
    if (exists(startTime.startTime)) {
      return new Timr(startTime.startTime, startTime)
    }

    throw new Error('When providing only an object when creating a timer, it must have a startTime property.')
  }

  return new Timr(startTime, options)
}

export {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad
}
