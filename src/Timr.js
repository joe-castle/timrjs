const EventEmitter = require('./EventEmitter');

const buildOptions = require('./buildOptions');
const validate = require('./validate');
const errors = require('./utils/errors');
const removeFromStore = require('./store').removeFromStore;
const formatTime = require('./utils/formatTime');

/**
 * @description Factory function for formatTime and formatStartTime
 *
 * @param {String} time - Either 'currentTime' or 'startTime'
 *
 * @return {Function} Formattime function closed over above value.
 */
const createFormatTime = time => (
  function createdFormatTime() {
    return formatTime(
      this[time],
      this.options.separator,
      this.options.outputFormat,
      this.options.formatType
    );
  }
);

/**
 * @description Creates a Timr.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @throws If the provided startTime is neither a number or a string,
 * or, incorrect format.
 */
function Timr(startTime, options) {
  EventEmitter.call(this);

  this.timer = null;
  this.running = false;
  this.startTime = validate(startTime);
  this.currentTime = this.startTime;
  this.changeOptions(options);
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
Timr.countdown = function countdown() {
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
};

/**
 * @description Stopwatch function.
 * Bound to a setInterval when start() is called.
 */
Timr.stopwatch = function stopwatch() {
  this.currentTime += 1;

  this.emit(
    'ticker',
    this.formatTime(),
    this.currentTime,
    this
  );

  if (this.currentTime > 3599999) {
    this.stop();
    this.emit('finish', this);
  }
};

Timr.prototype = Object.assign(Object.create(EventEmitter.prototype), {

  constructor: Timr,

  /**
   * @description Starts the timr.
   *
   * @param {Number} [delay] - Optional delay in ms to start the timer
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start(delay) {
    if (this.running && typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('Timer already running', this);
    } else {
      const startFn = () => {
        this.running = true;

        this.timer = this.startTime > 0 ?
        setInterval(Timr.countdown.bind(this), 1000) :
        setInterval(Timr.stopwatch.bind(this), 1000);
      };

      if (delay) {
        setTimeout(startFn, delay);
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

    this.running = false;

    return this;
  },

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
      throw errors(fn)('ticker');
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
      throw errors(fn)('finish');
    }

    this.on('finish', fn);

    return this;
  },

  /**
   * @description Converts currentTime to time format.
   * This is provided to the ticker method as the first argument.
   *
   * @return {String} The formatted time.
   */
  formatTime: createFormatTime('currentTime'),

  /**
   * @description Converts startTime to time format.
   *
   * @return {String} The formatted startTime.
   */
  formatStartTime: createFormatTime('startTime'),

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
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions(options) {
    this.options = buildOptions(options, this);

    return this;
  },

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

    this.startTime = this.currentTime = validate(startTime);

    return this.formatTime();
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

module.exports = Timr;
