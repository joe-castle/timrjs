import EventEmitter from './EventEmitter'

import buildOptions from './buildOptions'
import timeToSeconds from './timeToSeconds'
import formatTimeFn from './formatTime'
import dateToSeconds, { isDateFormat } from './dateToSeconds'
import { isFn, isNotFn, notExists, exists, isNotNum, checkType } from './validate'

import { FormattedTime, Listener, OptionalOptions, Options, Raw } from './types/common'
import { Status } from './types/enums'
import { ITimr } from './types/ITimr'

class Timr extends EventEmitter implements ITimr {
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
   * Creates a Timr.
   *
   * @param {String|Number} startTime The starting time for the Timr object.
   * @param {Object} [options] Options to customise the timer.
   *
   * @throws If the provided startTime is neither a number or a string,
   * or, incorrect format.
   */
  constructor (startTime: string | number | Date, options?: OptionalOptions) {
    super()

    // options needs to be built before startTime is set,
    // so it can work out the future date properly.
    this.changeOptions(options)
    this.setStartTime(startTime)

    this.status = Status.initialized
  }

  /**
   * Countdown function.
   *
   * Bound to a setInterval when start() is called.
   */
  private _countdown (): void {
    this.currentTime -= 1

    this.emit('ticker', {
      ...this.formatTime(),
      percentDone: this.percentDone(),
      currentTime: this.currentTime,
      startTime: this.startTime,
      self: this
    })

    if (this.currentTime <= 0) {
      this.clear()

      this.currentTime = this.startTime

      this.emit('finish', this)

      this.status = Status.finished
    }
  }

  /**
   * Stopwatch function.
   *
   * Bound to a setInterval when start() is called.
   */
  private _stopwatch (): void {
    this.currentTime += 1

    this.emit('ticker', {
      ...this.formatTime(),
      currentTime: this.currentTime,
      startTime: this.startTime,
      self: this
    })
  }

  private _listener (name: string, listener: Listener): this {
    if (isNotFn(listener)) {
      throw new TypeError(`Expected ${name} to be a function, instead got: ${checkType(listener)}`)
    }

    this.on(name, listener)

    return this
  }

  /**
   * Starts the Timr.
   *
   * @param {Number} [delay] Optional delay in ms to start the timer.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start (delay?: number): this {
    if (!this.started()) {
      if (this.options.countdown && this.startTime === 0) {
        throw new Error(
          'Unable to start timer when countdown = true and startTime = 0. ' +
          'This would cause the timer to count into negative numbers and never stop. ' +
          'Try setting countdown to false or amending the startTime.'
        )
      }

      const startFn = (): void => {
        /**
         * futureDate records the original date used when futureDate option is set to true,
         * this will re-run setStarTime to ensure the startTime is upto date.
         *
         * Note: Inside startFn so that delay works properly, if it was outside this scope,
         * the startTime would be out of sync after the delay finishes.
         */
        if (exists(this.futureDate)) {
          this.setStartTime(this.futureDate)
        }

        this.status = Status.started

        this.timer = this.options.countdown
          ? setInterval(() => this._countdown(), 1000)
          : setInterval(() => this._stopwatch(), 1000)
      }

      if (exists(delay)) {
        if (isNotNum(delay)) {
          throw new TypeError(`The delay argument passed to start must be a number, you passed: ${checkType(delay)}`)
        }
        this.delayTimer = setTimeout(startFn, delay)
      } else {
        startFn()
      }

      this.emit('onStart', this)
    } else {
      this.emit('onAlreadyStarted', this)
    }

    return this
  }

  /**
   * Pauses the Timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause (): this {
    this.clear()

    this.emit('onPause', this)

    this.status = Status.paused

    return this
  }

  /**
   * Stops the Timr, resetting the `currentTime` to the `startTime`.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop (): this {
    this.clear()

    this.currentTime = this.startTime

    this.emit('onStop', this)

    this.status = Status.stopped

    return this
  }

  /**
   * Clears the Timr, clearing the internal timer for both the `delayTimer`
   * and general `timer`.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear (): this {
    clearInterval(this.timer)
    clearTimeout(this.delayTimer)

    return this
  }

  /**
   * Destroys the Timr, clearing the intervals (as in `clear()), removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy (): this {
    this.emit('onDestroy', this)

    this.clear().removeAllListeners()

    // removeFromStore is added when the timr is added to a store,
    // so need to check if it's in a store before removing it.
    if (isFn<() => void>(this.removeFromStore)) {
      this.removeFromStore()
    }

    this.status = Status.destroyed

    return this
  }

  /**
   * Called every second the timer ticks down.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  ticker (listener: Listener): this {
    return this._listener('ticker', listener)
  }

  /**
   * Called once when the timer finishes.
   *
   * This will never be called when using a stopwatch.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  finish (listener: Listener): this {
    return this._listener('finish', listener)
  }

  /**
   * Called when the timer starts.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onStart (listener: Listener): this {
    return this._listener('onStart', listener)
  }

  /**
  * Called when the timer is already running and start is called
  *
  * @throws If the argument is not of type function.
  *
  * @param {Function} listener Function to added to events.
  * @return {Object} Returns a reference to the Timr so calls can be chained.
  */
  onAlreadyStarted (listener: Listener): this {
    return this._listener('onAlreadyStarted', listener)
  }

  /**
   * Called when the timer is paused.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onPause (listener: Listener): this {
    return this._listener('onPause', listener)
  }

  /**
   * Called when the timer is stopped.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onStop (listener: Listener): this {
    return this._listener('onStop', listener)
  }

  /**
   * Called when the timer is destroyed.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onDestroy (listener: Listener): this {
    return this._listener('onDestroy', listener)
  }

  /**
   * Converts seconds to time format.
   *
   * This is provided to the ticker function.
   *
   * @param {String} [time=currentTime] optionally format the startTime
   *
   * @return {Object} The `formattedTime` and `raw` values.
   */
  formatTime (time: 'currentTime' | 'startTime' = 'currentTime'): FormattedTime {
    return formatTimeFn(this[time], this.options, false)
  }

  /**
   * Returns the time elapsed in percent.
   * This is provided to the ticker.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone (): number {
    return 100 - Math.round((this.currentTime / this.startTime) * 100)
  }

  /**
   * Creates / changes `options` object.
   *
   * Merges with existing or default options.
   *
   * @param {Object} options The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions (options?: OptionalOptions): this {
    this.options = buildOptions(options, this.options)

    return this
  }

  /**
   * Sets new `startTime` after Timr has been created.
   *
   * Will clear `currentTime` and reset to new `startTime`.
   *
   * @param {String|Number} startTime The new `startTime`.
   *
   * @throws If no startTime is provided.
   * @throws If the provided time is not a string.
   * @throws If the provided time is not in the correct format HH:MM:SS.
   * @throws If the date string is not in the correct format.
   * @throws If the date string is in the correct format but can't be parsed, for example by using `13` for the month.
   * @throws If the date is in the past (unless provided `backupStartTime` is not in the past).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  setStartTime (startTime: string | number | Date, backupStartTime?: string | Date): this {
    this.clear()

    if (notExists(startTime)) {
      throw new Error('You must provide a startTime value.')
    }

    let newStartTime: number

    if (isDateFormat(startTime)) {
      newStartTime = dateToSeconds(startTime, backupStartTime ?? this.options.backupStartTime)
      this.futureDate = startTime
    } else {
      newStartTime = timeToSeconds(startTime)
      this.futureDate = null
    }

    this.startTime = newStartTime
    this.currentTime = newStartTime

    return this
  }

  /**
   * Shorthand for `this.formatTime(time).formattedTime`
   */
  getFt (time: 'currentTime' | 'startTime' = 'currentTime'): string {
    return this.formatTime(time).formattedTime
  }

  /**
   * Shorthand for `this.formatTime(time).raw`
   */
  getRaw (time: 'currentTime' | 'startTime' = 'currentTime'): Raw {
    return this.formatTime(time).raw
  }

  /**
   * Gets the Timrs `startTime`.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime (): number {
    return this.startTime
  }

  /**
   * Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime (): number {
    return this.currentTime
  }

  /**
   * Returns the current status. Or returns a boolean comparing
   * the provided statusName to the current status.
   *
   * @param {Object} [statusName] Optional `Status` to check
   *
   * @return Either the current status, or a boolean confirming the current status if
   * a statusName is provided. Will check `statusName === this.status`
   */
  getStatus (statusName?: Status): boolean | Status {
    return exists(statusName)
      ? this.status === statusName
      : this.status
  }

  /**
   * Returns true if the Timr has started
   *
   * @deprecated please use `this.started()` instead
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning (): boolean {
    return this.started()
  }

  /**
   * Checks whether the timer has been started or not
   *
   * @return {Boolean} True if running, false if not.
   */
  started (): boolean {
    return this.getStatus(Status.started) as boolean
  }
}

export default Timr
