import EventEmitter from './EventEmitter'

import buildOptions from './buildOptions'
import timeToSeconds from './timeToSeconds'
import formatTime from './formatTime'
import dateToSeconds from './dateToSeconds'
import { isFn, isNotFn, notExists, exists, isNotNum, checkType } from './validate'

/**
 * @description Creates a Timr.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @throws If the provided startTime is neither a number or a string,
 * or, incorrect format.
 *
 * @return {Object} - The newly created Timr object.
 */
function Timr (startTime, options) {
  EventEmitter.call(this)

  this.timer = null
  // options needs to be built before startTime is set,
  // so it can work out the future date properly.
  this.changeOptions(options)
  this.setStartTime(startTime)
}

/**
 * @description Creates event listeners.
 *
 * @param {String} The name of the listener.
 *
 * @return {Function} The function that makes listeners.
 */
function makeEventListener (name) {
  return function listener (fn) {
    if (isNotFn(fn)) {
      throw new TypeError(`Expected ${name} to be a function, instead got: ${checkType(fn)}`)
    }

    this.on(name, fn)

    return this
  }
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
function countdown () {
  this.currentTime -= 1

  this.emit('ticker', Object.assign(this.formatTime(), {
    percentDone: this.percentDone(),
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }))

  if (this.currentTime <= 0) {
    this.stop()
    this.emit('finish', this)
  }
}

/**
 * @description Stopwatch function.
 * Bound to a setInterval when start() is called.
 */
function stopwatch () {
  this.currentTime += 1

  this.emit('ticker', Object.assign(this.formatTime(), {
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }))
}

Timr.prototype = Object.assign(Object.create(EventEmitter.prototype), {

  constructor: Timr,

  /**
   * @description Starts the timr.
   *
   * @param {Number} [delay] - Optional delay in ms to start the timer
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start (delay) {
    if (!this.running) {
      if (this.options.countdown && this.startTime === 0) {
        throw new Error(
          'Unable to start timer when countdown = true and startTime = 0. ' +
          'This would cause the timer to count into negative numbers and never stop. ' +
          'Try setting countdown to false or amending the startTime.'
        )
      }

      const startFn = () => {
        /**
         * futureDate records the original date used when futureDate option is set to true,
         * this will re-run setStarTime to ensure the startTime is upto date.
         *
         * Note: Inside startFn so that delay works properly, if it was outside this scope,
         * the startTime would be out of sync after the delay finishes.
         */
        if (this.futureDate) this.setStartTime(this.futureDate)
        this.running = true

        this.timer = this.options.countdown
          ? setInterval(countdown.bind(this), 1000)
          : setInterval(stopwatch.bind(this), 1000)
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
    }

    return this
  },

  /**
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause () {
    this.clear()

    this.emit('onPause', this)

    return this
  },

  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop () {
    this.clear()

    this.currentTime = this.startTime

    this.emit('onStop', this)

    return this
  },

  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear () {
    clearInterval(this.timer)
    clearTimeout(this.delayTimer)

    this.running = false

    return this
  },

  /**
   * @description Destroys the timr,
   * clearing the interval, removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy () {
    this.emit('onDestroy', this)

    this.clear().removeAllListeners()

    // removeFromStore is added when the timr is added to a store,
    // so need to check if it's in a store before removing it.
    if (isFn(this.removeFromStore)) this.removeFromStore()

    return this
  },

  /**
   * @description The following methods create listeners.
   *
   * Ticker: Called every second the timer ticks down.
   * Finish: Called once when the timer finishes.
   * onStart: Called when the timer starts.
   * onPause: Called when the timer is paused.
   * onStop: Called when the timer is stopped.
   * onDestroy: Called when the timer is destroyed.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} fn - Function to be called every second.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  ticker: makeEventListener('ticker'),
  finish: makeEventListener('finish'),
  onStart: makeEventListener('onStart'),
  onPause: makeEventListener('onPause'),
  onStop: makeEventListener('onStop'),
  onDestroy: makeEventListener('onDestroy'),

  /**
   * @description Converts seconds to time format.
   * This is provided to the ticker.
   *
   * @param {String} [time=currentTime] - option to format the startTime
   *
   * @return {Object} The formatted time and raw values.
   */
  formatTime (time = 'currentTime') {
    return formatTime(this[time], this.options, false)
  },

  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone () {
    return 100 - Math.round((this.currentTime / this.startTime) * 100)
  },

  /**
   * @description Creates / changes options for a Timr.
   * Merges with existing or default options.
   *
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions (options) {
    this.options = buildOptions(options, this.options)

    return this
  },

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
  setStartTime (startTime) {
    this.clear()

    if (notExists(startTime)) throw new Error('You must provide a startTime value.')

    let newStartTime

    if (this.options.futureDate) {
      newStartTime = dateToSeconds(startTime)
      this.futureDate = startTime
    } else {
      newStartTime = timeToSeconds(startTime)
      this.futureDate = null
    }

    this.startTime = newStartTime
    this.currentTime = newStartTime

    return this
  },

  /**
   * @description Shorthand for this.formatTime(time).formattedTime
   */
  getFt (time = 'currentTime') {
    return this.formatTime(time).formattedTime
  },

  /**
   * @description Shorthand for this.formatTime(time).raw
   */
  getRaw (time = 'currentTime') {
    return this.formatTime(time).raw
  },

  /**
   * @description Gets the Timrs startTime.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime () {
    return this.startTime
  },

  /**
   * @description Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime () {
    return this.currentTime
  },

  /**
   * @description Gets the Timrs running value.
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning () {
    return this.running
  }
})

export default Timr
