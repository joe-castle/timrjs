import objectAssign from 'object-assign';

import EventEmitter from './EventEmitter';

import buildOptions from './buildOptions';
import validateStartTime from './validateStartTime';
import formatTime from './formatTime';
import dateToSeconds from './dateToSeconds';

/**
 * @description Creates a Timr.
 *
 * If the provided startTime is 0 or fasly, the constructor will automatically
 * setup the timr as stopwatch, this prevents the timer from counting down into
 * negative numbers and covers previous use case where 0 was used to setup a
 * stopwatch.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @throws If the provided startTime is neither a number or a string,
 * or, incorrect format.
 *
 * @return {Object} - The newly created Timr object.
 */
function Timr(startTime, options) {
  EventEmitter.call(this);

  this.timer = null;
  // this.running
  // this.startTime
  // this.currentTime
  // this.originalDate
  this.setStartTime(startTime);
  // this.options
  this.changeOptions(options);
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
function countdown() {
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
 * Bound to a setInterval when start() is called.
 */
function stopwatch() {
  this.currentTime += 1;

  this.emit(
    'ticker',
    this.formatTime(),
    this.currentTime,
    this
  );
}

Timr.prototype = objectAssign(Object.create(EventEmitter.prototype), {

  constructor: Timr,

  /**
   * @description Starts the timr.
   *
   * @param {Number} [delay] - Optional delay in ms to start the timer
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start(delay) {
    /* eslint-disable no-console */
    if (this.running && typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('Timer already running', this);
    } else {
    /* eslint-disable no-console */
      const startFn = () => {
        if (this.originalDate) {
          this.setStartTime(this.originalDate);
        }

        this.running = true;

        this.timer = this.options.countdown
          ? setInterval(countdown.bind(this), 1000)
          : setInterval(stopwatch.bind(this), 1000);
      };

      if (delay) {
        this.delayTimer = setTimeout(startFn, delay);
      } else {
        startFn();
      }
    }

    return this;
  },

  /**
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause() {
    this.clear();

    return this;
  },

  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop() {
    this.clear();

    this.currentTime = this.startTime;

    return this;
  },

  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear() {
    clearInterval(this.timer);
    clearTimeout(this.delayTimer);

    this.running = false;

    return this;
  },

  /**
   * @description Destroys the timr,
   * clearing the interval, removing all event listeners and removing,
   * from the store (if it's in one).
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy() {
    this.clear().removeAllListeners();

    // removeFromStore is added when the timr is added to a store,
    // so need to check if it's in a store before removing it.
    if (typeof this.removeFromStore === 'function') {
      this.removeFromStore();
    }

    return this;
  },

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
      throw new Error(`Expected ticker to be a function, instead got: ${typeof fn}`);
    }

    this.on('ticker', fn);

    return this;
  },

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
      throw new Error(`Expected finish to be a function, instead got: ${typeof fn}`);
    }

    this.on('finish', fn);

    return this;
  },

  /**
   * @description Converts seconds to time format.
   * This is provided to the ticker method as the first argument.
   *
   * @param {String} [time=currentTime] - option do format the startTime
   *
   * @return {String} The formatted time.
   */
  formatTime(time = 'currentTime') {
    return formatTime(this[time], this.options);
  },

  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker method as the second argument.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone() {
    return 100 - Math.round(this.currentTime / this.startTime * 100);
  },

  /**
   * @description Creates / changes options for a Timr.
   * Merges with existing or default options.
   *
   * Ignores { countdown: true } if startTime is 0 or falsy
   *
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions(options) {
    let newOptions = this.startTime > 0
      ? options
      : objectAssign({}, options, { countdown: false });

    this.options = buildOptions(newOptions, this.options);

    return this;
  },

  /**
   * @description Sets new startTime after Timr has been created.
   *
   * Will clear currentTime and reset to new startTime.
   * Will also change the timer to a stopwatch if the startTime is falsy or 0,
   * as per constructor.
   *
   * @param {String|Number} startTime - The new start time.
   *
   * @throws If the starttime is invalid.
   *
   * @return {String} Returns the formatted startTime.
   */
  setStartTime(startTime) {
    this.clear();

    // Coerces falsy values into 0.
    let newStartTime = 0;

    if (startTime) {
      const parsedDate = dateToSeconds(startTime);

      // Double checks parsedDate has a parsed property, in case an empty object is passed
      // in startTime.
      if (typeof parsedDate === 'object' && parsedDate.parsed) {
        this.originalDate = parsedDate.originalDate;
        newStartTime = parsedDate.parsed;
      } else {
        this.originalDate = false;
        newStartTime = parsedDate;
      }
    }

    // Changes to stopwatch only if setStartTime is run after Timr creation
    // and the startTime is 0.
    // The constructor will handle this on instantiation.
    if (!newStartTime && this.options) {
      this.changeOptions({ countdown: false });
    }

    this.startTime = this.currentTime = validateStartTime(newStartTime);

    return this;
  },

  /**
   * @description Gets the Timrs startTime.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime() {
    return this.startTime;
  },

  /**
   * @description Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime() {
    return this.currentTime;
  },

  /**
   * @description Gets the Timrs running value.
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning() {
    return this.running;
  },
});

export default Timr;
