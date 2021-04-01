import formatTime from './formatTime'
import timeToSeconds from './timeToSeconds'
import dateToSeconds from './dateToSeconds'
import createStore from './createStore'
import zeroPad from './zeroPad'

import Timr from './Timr'
import { isObj, exists } from './validate'

import { OptionalOptions } from './types'

/**
   * @description Creates a new Timr object.
   *
   * @param {string|number|object} startTime - The starting time for the timr object.
   * Or an object with startTime and options.
   * @param {object} [options] - Options to customise the timer.
   *
   * @return {object} A new Timr object.
   */
function create (startTime: string | number | Date | OptionalOptions, options?: OptionalOptions): Timr {
  if (isObj<OptionalOptions>(startTime)) {
    if (exists(startTime.startTime)) {
      return new Timr(startTime.startTime as string | number, startTime)
    }

    throw new Error('When providing only an object when creating a timer, it must have a startTime property.')
  }

  return new Timr(startTime, options)
}

// type exports
export {
  OptionalOptions,
  Options,
  OptionsFormatValues,
  FormatValueFn,
  Store,
  Events,
  Listener,
  FormattedTime,
  Raw,
  Status
} from './types'

export {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad
}
