'use strict';

const EventEmitter = require('events');

const zeroPad = require('./zeroPad');

/**
 * Class representing a new Timr.
 * @extends EventEmitter
 */
module.exports = class Timr extends EventEmitter {
  /**
   * @description Creates a Timr.
   * @param {Number} The startTime (in seconds)
   */
  constructor(startTime) {
    super();
    this.timer = null;
    this.running = false;
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
        this.timer = setInterval(this.countdown.bind(this), 1000);
      } else {
        this.timer = setInterval(this.stopwatch.bind(this), 1000);
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
   * @param {Function} Function to be called every second.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  ticker(fn) {
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
   * @param {Function} Function to be called when finished.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  finish(fn) {
    this.on('finish', fn);
    return this;
  }
  /**
   * @description A stopwatch style counter.
   * Counts upwards, rather than down
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  stopwatch() {
    this.currentTime += 1;
    this.emit('ticker', this.formatTime(), this.currentTime);
    return this;
  }
  /**
   * @description The main Timr function for counting down.
   * Bound to a setInterval timer when start() is called.
   *
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  countdown() {
    this.currentTime -= 1;
    this.emit('ticker', this.formatTime(), this.currentTime, this.startTime);
    if (this.currentTime <= 0) {
      this.emit('finish');
      this.stop();
    }
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
      , minutes = seconds / 60;
    if (minutes >= 1) {
      let hours = minutes / 60;
      minutes = Math.floor(minutes);
      if (hours >= 1) {
        hours = Math.floor(hours);
        return `${zeroPad(hours)}:${zeroPad(minutes - hours * 60)}:${zeroPad(seconds - minutes * 60)}`
      }
      return `${zeroPad(minutes)}:${zeroPad(seconds - minutes * 60)}`
    }
    return `00:${zeroPad(seconds)}`
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
    return this.running
  }
};
