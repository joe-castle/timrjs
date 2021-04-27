import formatTime from './formatTime'
import timeToSeconds from './timeToSeconds'
import dateToSeconds from './dateToSeconds'
import createStore from './createStore'
import zeroPad from './zeroPad'
import Timr from './Timr'
import { isObj, exists } from './validate'

import { OptionalOptions, OptionalOptionsWithStartTime } from './types/common'
import { ITimr } from './types/ITimr'

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time in string format.
 *
 * Examples of accepted format:
 *  - `'10:00:00'` A 10 hour timer.
 *  - `'10:00'` A 10 minute timer.
 *  - `'10'` A 10 second timer.
 *  - `'10m'` A 10 minute timer.
 *  - `'10h'` A 10 hour timer.
 *  - `'10d'` A 10 day timer.
 *  - `'2021-12-25'` A countdown timer to midnight on Christmas Day.
 *  - `'2021-12-25 10:00'` A countdown timer to 10am on Christmas Day.
 *
 * @return A new Timr object.
 */
function create (startTime: string): ITimr

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time in string format.
 *
 * Examples of accepted format:
 *  - `'10:00:00'` A 10 hour timer.
 *  - `'10:00'` A 10 minute timer.
 *  - `'10'` A 10 second timer.
 *  - `'10m'` A 10 minute timer.
 *  - `'10h'` A 10 hour timer.
 *  - `'10d'` A 10 day timer.
 *  - `'2021-12-25'` Creates a countdown timer to midnight on Christmas Day.
 *  - `'2021-12-25 10:00'` Creates a countdown timer to 10am on Christmas Day.
 * @param options Options to customise the timer.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return A new Timr object.
 */
function create (startTime: string, options: OptionalOptions): ITimr

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time in seconds.
 *
 * @return A new Timr object.
 */
function create (startTime: number): ITimr

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time in seconds.
 * @param options Options to customise the timer.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return A new Timr object.
 */
function create (startTime: number, options: OptionalOptions): ITimr

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time as a `Date`.
 * The timer will countdown to the point in time specified by the date.
 *
 * @return A new Timr object.
 */
function create (startTime: Date): ITimr

/**
 * Creates a new Timr object.
 *
 * @param startTime The starting time as a `Date`.
 * The timer will countdown to the point in time specified by the date.
 * @param options Options to customise the timer.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return A new Timr object.
 */
function create (startTime: Date, options: OptionalOptions): ITimr

/**
 * Creates a new Timr object.
 *
 * @param options Options to customise the timer with a `startTime` property.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `startTime` The starting time, follows the same format as other overloads.
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return A new Timr object.
 */
function create (options: OptionalOptionsWithStartTime): ITimr

/**
 * Creates a new Timr object.
 *
 * @param {string|number|Date|object} startTime The starting time. Or an object with startTime and options.
 *
 * `string` Examples of accepted format:
 *  - `'10:00:00'` A 10 hour timer.
 *  - `'10:00'` A 10 minute timer.
 *  - `'10'` A 10 second timer.
 *  - `'10m'` A 10 minute timer.
 *  - `'10h'` A 10 hour timer.
 *  - `'10d'` A 10 day timer.
 *  - `'2021-12-25'` Creates a countdown timer to midnight on Christmas Day.
 *  - `'2021-12-25 10:00'` Creates a countdown timer to 10am on Christmas Day.
 *
 * `number` In seconds.
 *
 * `Date` The timer will countdown to the point in time specified by the date.
 *
 * `object` Options to customise the timer with a `startTime` property. See below.
 *
 * **Note**: If an `object` is provided to `startTime` the `options` argument will be ignored.
 *
 * @param [options] Options to customise the timer.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return A new Timr object.
 */
function create (startTime: string | number | Date | OptionalOptionsWithStartTime, options?: OptionalOptions): ITimr

/**
 * Creates a new Timr object.
 *
 * @param {string|number|Date|object} startTime The starting time. Or an object with startTime and options.
 *
 * `string` Examples of accepted format:
 *  - `'10:00:00'` A 10 hour timer.
 *  - `'10:00'` A 10 minute timer.
 *  - `'10'` A 10 second timer.
 *  - `'10m'` A 10 minute timer.
 *  - `'10h'` A 10 hour timer.
 *  - `'10d'` A 10 day timer.
 *  - `'2021-12-25'` Creates a countdown timer to midnight on Christmas Day.
 *  - `'2021-12-25 10:00'` Creates a countdown timer to 10am on Christmas Day.
 *
 * `number` In seconds.
 *
 * `Date` The timer will countdown to the point in time specified by the date.
 *
 * `object` Options to customise the timer with a `startTime` property. See below.
 *
 * **Note**: If an `object` is provided to `startTime` the `options` argument will be ignored.
 *
 * @param {Object} [options] Options to customise the timer.
 *
 * Accepts the following properties, see `README.md` for further details:
 * - `formatOutput` How the time should be formatted as a string.
 * - `countdown` Whether the timer should count down or up.
 * - `formatValues` An object of functions to format each part of the formatted string individually.
 * - `backupStartTime` A backupStartTime for timers that countdown to a futureDate, in case that time is in the past.
 *
 * @return {Object} A new Timr object.
 */
function create (startTime: string | number | Date | OptionalOptionsWithStartTime, options?: OptionalOptions): ITimr {
  if (isObj<OptionalOptionsWithStartTime>(startTime)) {
    if (exists(startTime.startTime)) {
      return new Timr(startTime.startTime, startTime)
    }

    throw new Error('When providing only an object when creating a timer, it must have a startTime property.')
  }

  return new Timr(startTime, options)
}

// type exports
export {
  OptionalOptions,
  OptionalOptionsWithStartTime,
  Options,
  FormatValues,
  OptionsFormatValues,
  FormatValueFn,
  Store,
  Events,
  Listener,
  FormattedTime,
  Raw
} from './types/common'

export {
  Status
} from './types/enums'

export {
  ITimr
} from './types/ITimr'

export {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad
}
