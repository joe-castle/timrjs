'use strict';

const EventEmitter = require('events');

const createStartTime = require('./createStartTime');
const buildOptions = require('./buildOptions');
const formatTime = require('./formatTime');
const errors = require('./errors');

const removeFromStore = require('./store').removeFromStore;

/**
 * Class representing a new Timr.
 * @extends EventEmitter
 */
class Timr extends EventEmitter {
  /**
   * @description Creates a Timr.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @throws If the provided startTime is neither a number or a string,
   * or, incorrect format.
   */
  constructor(startTime, options) {
    super();

    options = buildOptions(options);

    this.timer = null;
    this.running = false;
    this.outputFormat = options.outputFormat;
    this.separator = options.separator;
    this.startTime = createStartTime(startTime);
    this.currentTime = this.startTime;
  }

  /**
   * @description Countdown function.
   * Bound to a setInterval timer when start() is called.
   */
  static countdown() {
    this.currentTime -= 1;

    this.emit(
      'ticker',
      this.formatTime(),
      this.percentDone(),
      this.currentTime,
      this.startTime,
      this
    );

    if (this.currentTime <= 0) {
      this.stop();
      this.emit('finish', this);
    }
  }

  /**
   * @description Stopwatch function.
   * Bound to a setInterval timer when start() is called.
   */
  static stopwatch() {
    this.currentTime += 1;

    this.emit('ticker', this.formatTime(), this.currentTime);
  }

  /**
   * @description Starts the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start() {
    if (!this.running) {
      this.running = true;

      if (this.startTime > 0) {
        this.timer = setInterval(Timr.countdown.bind(this), 1000);
      } else {
        this.timer = setInterval(Timr.stopwatch.bind(this), 1000);
      }

    } else {
      console.warn('Timer already running');
    }

    return this;
  }

  /**
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause() {
    this.clear();

    return this;
  }

  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop() {
    this.clear();

    this.currentTime = this.startTime;

    return this;
  }

  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear() {
    clearInterval(this.timer);

    this.running = false;

    return this;
  }

  /**
   * @description Destroys the timr,
   * clearing the interval, removing all event listeners and removing,
   * from the store.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy() {
    this.clear().removeAllListeners();

    removeFromStore(this);

    return this;
  }

  /**
   * @description The ticker method is called every second
   * the timer ticks down.
   *
   * As Timr inherits from EventEmitter, this can be called
   * multiple times with different functions and each one will
   * be called when the event is emitted.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} fn - Function to be called every second.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  ticker(fn) {
    if (typeof fn !== 'function') {
      throw errors(fn)('ticker');
    }

    this.on('ticker', fn);

    return this;
  }

  /**
   * @description The finish method is called once when the
   * timer finishes.
   *
   * As Timr inherits from EventEmitter, this can be called
   * multiple times with different functions and each one will
   * be called when the event is emitted.
   *
   * @throws If the argument is not of type function.
   *
   * @param {Function} fn - Function to be called when finished.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  finish(fn) {
    if (typeof fn !== 'function') {
      throw errors(fn)('finish');
    }

    this.on('finish', fn);

    return this;
  }

  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker method as the second argument.
   *
   * @returns {Number} Time elapsed in percent.
   */
  percentDone() {
    return 100 - Math.round(this.currentTime / this.startTime * 100);
  }

  /**
   * @description Sets new startTime after Timr has been created.
   * Will clear currentTime and reset to new startTime.
   *
   * @param {String|Number} startTime - The new start time.
   *
   * @throws If the starttime is invalid.
   *
   * @return {String} Returns the formatted startTime.
   */
  setStartTime(startTime) {
    this.clear();

    this.startTime = this.currentTime = createStartTime(startTime);

    return this.formatTime();
  }

  /**
   * @description Gets the Timrs startTime.
   *
   * @returns {Number} Current time in seconds
   */
  getStartTime() {
    return this.startTime;
  }
  /**
   * @description Gets the Timrs currentTime.
   *
   * @returns {Number} Current time in seconds
   */
  getCurrentTime() {
    return this.currentTime;
  }

  /**
   * @description Gets the Timrs running value.
   *
   * @returns {Boolean} True if running, false if not.
   */
  isRunning() {
    return this.running;
  }
};

/**
 * @description Converts currentTime to time format.
 * This is provided to the ticker method as the first argument.
 *
 * @return {String} The formatted time.
 */
Timr.prototype.formatTime = formatTime;

/**
 * @description Converts startTime to time format.
 * This is provided to the ticker method as the first argument.
 *
 * @return {String} The formatted time.
 */
Timr.prototype.formatStartTime = function() {
  return formatTime.call(this, this.startTime);
};

module.exports = Timr;
