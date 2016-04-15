'use strict';

const EventEmitter = require('events');

const createStartTime = require('./createStartTime');
const buildOptions = require('./buildOptions');
const zeroPad = require('./zeroPad');
const errors = require('./errors');

const countdown = require('./countdown');
const stopwatch = require('./stopwatch');

const removeFromStore = require('./store').removeFromStore;

/**
 * Class representing a new Timr.
 * @extends EventEmitter
 */
module.exports = class Timr extends EventEmitter {
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

    this.timer = null;
    this.running = false;
    this.options = buildOptions(options);
    this.startTime = createStartTime(startTime);
    this.currentTime = this.startTime;
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
   * @description Converts seconds back to time format.
   * This is provided to the ticker method as the first argument.
   *
   * @return {String} Returns the formatted string.
   */
  formatTime() {
    let seconds = this.currentTime
      , minutes = seconds / 60
      , output = this.options.outputFormat
      , sep = this.options.separator;

    if (minutes >= 1) {
      let hours = minutes / 60;
      minutes = Math.floor(minutes);

      if (hours >= 1) {
        hours = Math.floor(hours);

        return zeroPad(
          `${hours}${sep}${minutes - hours * 60}${sep}${seconds - minutes * 60}`
        );
      }

      return zeroPad(
        `${output === 'HH:MM:SS' ? `0${sep}` : ''}${minutes}${sep}${seconds - minutes * 60}`
      );
    }

    return zeroPad(
      `${output === 'HH:MM:SS' ? `0${sep}0${sep}` : output === 'MM:SS' ? `0${sep}` : ''}${seconds}`
    );
  }

  /**
   * @description Returns the time elapsed in percent.
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
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  setStartTime(startTime) {
    this.clear();

    this.startTime = this.currentTime = createStartTime(startTime);

    return this;
  }

  /**
   * @description Gets the Timrs current time.
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
