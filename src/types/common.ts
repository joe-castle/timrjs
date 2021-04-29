import { Status } from './enums'
import { ITimr } from './ITimr'

/**
 * The options object provided to Timr that gets merged with defaults and
 * existing if applicable.
 */
export interface OptionalOptions {
  formatOutput?: string
  countdown?: boolean
  formatValues?: OptionsFormatValues
  backupStartTime?: string | Date
}

/**
 * Used when providing only an object to `create()` to force the use
 * of `startTime`
 */
export interface OptionalOptionsWithStartTime extends OptionalOptions {
  startTime: string | number | Date
}

/**
 * The options object after being built from `OptionalOptions` and default.
 */
export interface Options {
  formatOutput: string
  countdown: boolean
  formatValues: FormatValues
  startTime?: string | number | Date
  backupStartTime?: string | Date
}

/**
 * An object of functions to format each value within the `Raw` object when the
 * time is formatted.
 */
export interface FormatValues {
  ss?: FormatValueFn
  SS?: FormatValueFn
  mm?: FormatValueFn
  MM?: FormatValueFn
  hh?: FormatValueFn
  HH?: FormatValueFn
  dd?: FormatValueFn
  DD?: FormatValueFn
  [key: string]: FormatValueFn | undefined
}

/**
 * An extended version of `FormatValues` that accepts a default property.
 *
 * Used to configure any non configured formatValue with a default `FormatValueFn`.
 */
export interface OptionsFormatValues extends FormatValues {
  default?: FormatValueFn
}

/**
 * A function used to format an individual value in `FormatValues`
 */
export type FormatValueFn = (value: number) => string | number

/**
 * The output from the `formatTime` function
 */
export interface FormattedTime {
  /**
   * The formatted string as dictated but the `formatOuput` and `formatValues` properties of `Options`
   */
  formattedTime: string

  /**
   * The raw values used to calculate the current time
   */
  raw: Raw
}

/**
 * The raw values used to calculate the current time
 */
export interface Raw {
  SS: number
  MM: number
  HH: number
  DD: number
  ss: number
  mm: number
  hh: number
  dd: number
  [key: string]: number
}

/**
 * The makeup of the EventEmitters events property
 */
export interface Events {
  [key: string]: Listener[]
}

/**
 * A listener function used by methods that listen for a particular event
 */
export type Listener<T = any, U = any, V = any, W = any, X = any> = (arg1?: T, arg2?: U, arg3?: V, arg4?: W, arg5?: X, ...args: any[]) => void

/**
 * A store holds multiple timers and can execute methods on all of them at the same time.
 */
export interface Store {

  /**
   * Adds the provided timer to the store.
   *
   * @param timr A Timr object.
   *
   * @throws If the provided timer is not a Timr object.
   * @throws If the provided timer is already in a store.
   *
   * @return The provided Timr object.
   */
  add: (timr: ITimr) => ITimr

  /**
   * Returns an array of all the timers in the store.
   *
   * @return The array of Timrs.
   */
  getAll: () => ITimr[]

  /**
   * Starts all the timers in the store.
   */
  startAll: () => void

  /**
   * Pauses all the timers in the store.
   */
  pauseAll: () => void

  /**
   * Stops all the timers in the store.
   */
  stopAll: () => void

  /**
   * Returns an array of all the timers that are in the same status
   * as the one provided.
   *
   * @param statusName The status to check.
   *
   * @return An array of timers that are in a state matched by the provided `statusName`
   */
  getStatus: (statusName: Status) => ITimr[]

  /**
   * Returns an array of timers that are currently running.
   *
   * @deprecated Please use `started()` instead
   *
   * @return The array of running Timrs
   */
  isRunning: () => ITimr[]

  /**
   * Returns an array of timers that have started.
   *
   * @return The array of Timrs that have started
   */
  started: () => ITimr[]

  /**
   * Removes the provided Timr from the store
   *
   * @param timr The Timr to remove
   */
  removeFromStore: (timr: ITimr) => void

  /**
   * Destroys all Timrs in the store
   */
  destroyAll: () => void

}
