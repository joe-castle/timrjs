'use strict';

const EventEmitter = require('events');

const timeToSeconds = require('./timeToSeconds');
const buildOptions = require('./buildOptions');
const zeroPad = require('./zeroPad');

const countdown = require('./countdown');
const stopwatch = require('./stopwatch');

/**
 * Class representing a new Timr.
 * @extends EventEmitter
 */
module.exports = class Timr extends EventEmitter {
  /**
   * @description Creates a Timr.
   *
   * @param {String} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @throws If the provided starTime is neither a number or a string.
   */
  constructor(startTime, options) {
    super();

    if (typeof startTime === 'string') {
      startTime = timeToSeconds(startTime);
    }

    else if (typeof startTime !== 'number') {
      throw new TypeError(
        `Warning! Expected starting time to be of type string or number, instead got: ${typeof startTime}`
      );
    }

    this.timer = null;
    this.running = false;
    this.options = buildOptions(options);
    this.startTime = startTime;
    this.currentTime = startTime;
  }

  /**
   * @description Starts the timr.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  start() {
    if (!this.running) {
      this.running = true;

      if (this.startTime > 0) {
        this.timer = setInterval(countdown.bind(this, this), 1000);
      } else {
        this.timer = setInterval(stopwatch.bind(this, this), 1000);
      }

    } else {
      console.warn('Timer already running');
    }

    return this;
  }

  /**
   * @description Pauses the timr.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  pause() {
    this.clear();

    this.running = false;

    return this;
  }

  /**
   * @description Stops the timr.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  stop() {
    this.clear();

    this.running = false;
    this.currentTime = this.startTime;

    return this;
  }

  /**
   * @description Clears the timr.
   * Only used by internal methods.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  clear() {
    clearInterval(this.timer);

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
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  ticker(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(
        `Warning! Ticker requires a function, instead got: ${typeof fn}`
      );
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
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  finish(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(
        `Warning! Finish requires a function, instead got: ${typeof fn}`
      );
    }

    this.on('finish', fn);

    return this;
  }

  /**
   * @description Converts seconds back to time format.
   * This is provided to the ticker method as the first argument.
   *
   * @return {String} Returns the formatted string.
   */
  formatTime() {
    let seconds = this.currentTime
      , minutes = seconds / 60
      , sep = this.options.separator;

    if (minutes >= 1) {
      let hours = minutes / 60;
      minutes = Math.floor(minutes);

      if (hours >= 1) {
        hours = Math.floor(hours);

        return `${zeroPad(hours)}${sep}${zeroPad(minutes - hours * 60)}${sep}${zeroPad(seconds - minutes * 60)}`;
      }

      return `${this.options.outputFormat === 'HH:MM:SS' ? `00${sep}` : ''}${zeroPad(minutes)}${sep}${zeroPad(seconds - minutes * 60)}`;
    }

    return `${this.options.outputFormat === 'HH:MM:SS' ? `00${sep}00${sep}` : this.options.outputFormat === 'MM:SS' ? `00${sep}` : '' }${zeroPad(seconds)}`;
  }

  /**
   * @description Gets the Timrs current time.
   * @returns {Number} Current time in seconds
   */
  getCurrentTime() {
    return this.currentTime;
  }

  /**
   * @description Gets the Timrs running value.
   * @returns {Boolean} True if running, false if not.
   */
  isRunning() {
    return this.running;
  }
};
