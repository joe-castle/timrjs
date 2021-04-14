import EventEmitter from './EventEmitter'

import buildOptions from './buildOptions'
import timeToSeconds from './timeToSeconds'
import formatTimeFn from './formatTime'
import dateToSeconds, { isDateFormat } from './dateToSeconds'
import { isFn, isNotFn, notExists, exists, isNotNum, checkType } from './validate'

import { FormattedTime, Listener, OptionalOptions, Options, Raw, Status } from './types'

class Timr extends EventEmitter {
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
   * @description Creates a Timr.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
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
   * @description Countdown function.
   *
   * Bound to a setInterval when start() is called.
   */
  _countdown (): void {
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
   * @description Stopwatch function.
   *
   * Bound to a setInterval when start() is called.
   */
  _stopwatch (): void {
    this.currentTime += 1

    this.emit('ticker', {
      ...this.formatTime(),
      currentTime: this.currentTime,
      startTime: this.startTime,
      self: this
    })
  }

  _listener (this: Timr, name: string, listener: Listener): Timr {
    if (isNotFn(listener)) {
      throw new TypeError(`Expected ${name} to be a function, instead got: ${checkType(listener)}`)
    }

    this.on(name, listener)

    return this
  }

  /**
   * @description Starts the timr.
   *
   * @param {Number} [delay] - Optional delay in ms to start the timer
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start (delay?: number): Timr {
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
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause (): Timr {
    this.clear()

    this.emit('onPause', this)

    this.status = Status.paused

    return this
  }

  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop (): Timr {
    this.clear()

    this.currentTime = this.startTime

    this.emit('onStop', this)

    this.status = Status.stopped

    return this
  }

  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear (): Timr {
    clearInterval(this.timer)
    clearTimeout(this.delayTimer)

    return this
  }

  /**
   * @description Destroys the timr,
   * clearing the interval, removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy (): Timr {
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
   * @description Called every second the timer ticks down.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  ticker (listener: Listener): Timr {
    return this._listener('ticker', listener)
  }

  /**
   * @description Called once when the timer finishes.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  finish (listener: Listener): Timr {
    return this._listener('finish', listener)
  }

  /**
   * @description Called when the timer starts.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onStart (listener: Listener): Timr {
    return this._listener('onStart', listener)
  }

  /**
  * @description Called when the timer is already running and start is called
  *
  * @throws If the argument is not of type function.
  *
  * @param {Function} listener - Function to added to events.
  * @return {Object} Returns a reference to the Timr so calls can be chained.
  */
  onAlreadyStarted (listener: Listener): Timr {
    return this._listener('onAlreadyStarted', listener)
  }

  /**
   * @description Called when the timer is paused.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onPause (listener: Listener): Timr {
    return this._listener('onPause', listener)
  }

  /**
   * @description Called when the timer is stopped.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onStop (listener: Listener): Timr {
    return this._listener('onStop', listener)
  }

  /**
   * @description Called when the timer is destroyed.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} listener - Function to added to events.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  onDestroy (listener: Listener): Timr {
    return this._listener('onDestroy', listener)
  }

  /**
   * @description Converts seconds to time format.
   * This is provided to the ticker.
   *
   * @param {String} [time=currentTime] - option to format the startTime
   *
   * @return {Object} The formatted time and raw values.
   */
  formatTime (time: 'currentTime' | 'startTime' = 'currentTime'): FormattedTime {
    return formatTimeFn(this[time], this.options, false)
  }

  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone (): number {
    return 100 - Math.round((this.currentTime / this.startTime) * 100)
  }

  /**
   * @description Creates / changes options for a Timr.
   * Merges with existing or default options.
   *
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions (options?: OptionalOptions): Timr {
    this.options = buildOptions(options, this.options)

    return this
  }

  /**
   * @description Sets new startTime after Timr has been created.
   * Will clear currentTime and reset to new startTime.
   *
   * @param {String|Number} startTime - The new start time.
   *
   * @throws If no startTime is provided.
   *
   * @return {Object} The original Timr object.
   */
  setStartTime (startTime: string | number | Date, backupStartTime?: string | Date): Timr {
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
   * @description Shorthand for this.formatTime(time).formattedTime
   */
  getFt (time: 'currentTime' | 'startTime' = 'currentTime'): string {
    return this.formatTime(time).formattedTime
  }

  /**
   * @description Shorthand for this.formatTime(time).raw
   */
  getRaw (time: 'currentTime' | 'startTime' = 'currentTime'): Raw {
    return this.formatTime(time).raw
  }

  /**
   * @description Gets the Timrs startTime.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime (): number {
    return this.startTime
  }

  /**
   * @description Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime (): number {
    return this.currentTime
  }

  /**
   * @description Returns the current status. Or returns
   * a boolean comparing the provided statusName to the current
   * status.
   *
   * @param {Status} [statusName] optional statusname to check
   *
   * @returns either the current status, or a boolean confirming the current status if
   * a statusName is provided. Will check `statusName === this.status`
   */
  getStatus (statusName?: Status): boolean | string {
    return exists(statusName)
      ? this.status === statusName
      : this.status
  }

  /**
   * @description Gets the Timrs running value.
   *
   * @deprecated please use `this.started()` instead
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning (): boolean {
    return this.started()
  }

  /**
   * @description Checks whether the timer has been started or not
   *
   * @return {Boolean} True if running, false if not.
   */
  started (): boolean {
    return this.getStatus(Status.started) as boolean
  }
}

export default Timr
