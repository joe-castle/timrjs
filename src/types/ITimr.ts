import { FormattedTime, Listener, OptionalOptions, Options, Raw } from './common'
import { Status } from './enums'

export interface ITimr {
  timer: NodeJS.Timeout
  delayTimer: NodeJS.Timeout
  currentTime: number
  startTime: number
  options: Options
  futureDate: string | number | Date | null
  status: Status
  removeFromStore?: null | (() => void)
  [key: string]: any

  /**
   * Starts the Timr.
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  start: (() => this) & ((delay: number) => this)

  /**
   * Pauses the Timr.
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  pause: () => this

  /**
   * Stops the Timr, resetting the `currentTime` to the `startTime`.
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  stop: () => this

  /**
   * Clears the Timr, clearing the internal timer for both the `delayTimer`
   * and general `timer`.
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  clear: () => this

  /**
   * Destroys the Timr, clearing the intervals (as in `clear()), removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  destroy: () => this

  /**
   * Called every second the timer ticks down.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  ticker: (listener: Listener) => this

  /**
   * Called once when the timer finishes, when it reaches 0.
   *
   * This will never be called when using a stopwatch.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  finish: (listener: Listener) => this

  /**
   * Called when the timer starts.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  onStart: (listener: Listener) => this

  /**
  * Called when the timer is already running and start is called
  *
  * @throws If the argument is not of type function.
  *
  * @param listener Function to added to events.
  * @return Returns a reference to the Timr so calls can be chained.
  */
  onAlreadyStarted: (listener: Listener) => this

  /**
   * Called when the timer is paused.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  onPause: (listener: Listener) => this

  /**
   * Called when the timer is stopped.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  onStop: (listener: Listener) => this

  /**
   * Called when the timer is destroyed.
   *
   * @throws If the argument is not of type function.
   *
   * @param listener Function to added to events.
   * @return Returns a reference to the Timr so calls can be chained.
   */
  onDestroy: (listener: Listener) => this

  /**
   * Converts `currentTime` to time format.
   *
    * This is provided to the ticker function.
   *
   * @return The `formattedTime` and `raw` values.
   */
  formatTime: (() => FormattedTime) & ((time: 'currentTime') => FormattedTime) & ((time: 'startTime') => FormattedTime)

  /**
   * Returns the time elapsed in percent.
   *
   * This is provided to the ticker function.
   *
   * @return Time elapsed in percent.
   */
  percentDone: () => number

  /**
   * Creates / Re-builds the `options` object using existing and default.
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  changeOptions: (() => this) & ((options: OptionalOptions) => this)

  /**
   * Sets new `startTime` after Timr has been created.
   *
   * Will clear `currentTime` and reset to new `startTime`.
   *
   * @param startTime The new `startTime` in string format.
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
   * @throws If no `startTime` is provided.
   * @throws If the provided time is not a string.
   * @throws If the provided time is not in the correct format HH:MM:SS.
   * @throws If the date string is not in the correct format.
   * @throws If the date string is in the correct format but can't be parsed, for example by using `13` for the month.
   * @throws If the date is in the past (unless provided `backupStartTime` is not in the past).
   *
   * @return Returns a reference to the Timr so calls can be chained.
   */
  setStartTime: ((startTime: string) => this) & ((startTime: number) => this) & ((startTime: Date) => this) & ((startTime: string, backupStartTime: string) => this) & ((startTime: Date, backupStartTime: string) => this) & ((startTime: string, backupStartTime: Date) => this) & ((startTime: Date, backupStartTime: Date) => this)

  /**
   * Shorthand for `this.formatTime('currentTime').formattedTime`
   */
  getFt: (() => string) & ((time: 'currentTime') => string) & ((time: 'startTime') => string)

  /**
   * Shorthand for `this.formatTime('currentTime').raw`
   */
  getRaw: (() => Raw) & ((time: 'currentTime') => Raw) & ((time: 'startTime') => Raw)

  /**
   * Gets the Timrs `startTime`.
   *
   * @return Start time in seconds.
   */
  getStartTime: () => number

  /**
   * Gets the Timrs `currentTime`.
   *
   * @return Current time in seconds.
   */
  getCurrentTime: () => number

  /**
   * Returns the current status. Or returns a boolean comparing
   * the provided statusName to the current status.
   *
   * @param [statusName] Optional `Status` to check
   *
   * @return Either the current status, or a boolean confirming the current status if
   * a statusName is provided. Will check `statusName === this.status`
   */
  getStatus: (statusName?: Status) => boolean | Status

  /**
   * Returns true if the Timr has started
   *
   * @deprecated please use `this.started()` instead
   *
   * @return True if running, false if not.
   */
  isRunning: () => boolean

  /**
   * Checks whether the timer has been started or not
   *
   * @return True if running, false if not.
   */
  started: () => boolean
}
