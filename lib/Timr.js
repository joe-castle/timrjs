var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import objectAssign from 'object-assign';

import EventEmitter from './EventEmitter';

import buildOptions from './buildOptions';
import validateStartTime from './validateStartTime';
import _formatTime from './formatTime';
import dateToSeconds from './dateToSeconds';

/**
 * @description Creates a Timr.
 *
 * If the provided startTime is 0 or fasly, the constructor will automatically
 * setup the timr as stopwatch, this prevents the timer from counting down into
 * negative numbers and covers previous ( < v1.0.0 ) use case where 0 was used to setup a
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
 * @description Creats event listeners.
 *
 * @param {String} The name of the listener.
 *
 * @return {Function} The function that makes listeners.
 */
function makeListenerGenerator(name) {
  return function listenerGenerator(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected ' + name + ' to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
    }

    this.on(name, fn);

    return this;
  };
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
function countdown() {
  this.currentTime -= 1;

  this.emit('ticker', objectAssign(this.formatTime(), {
    percentDone: this.percentDone(),
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }));

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

  this.emit('ticker', objectAssign(this.formatTime(), {
    currentTime: this.currentTime,
    startTime: this.startTime,
    self: this
  }));
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
  start: function start(delay) {
    var _this = this;

    /* eslint-disable no-console */
    if (this.running && typeof console !== 'undefined' && typeof console.warn === 'function') {
      console.warn('Timer already running', this);
    } else {
      /* eslint-disable no-console */
      var startFn = function startFn() {
        if (_this.originalDate) {
          _this.setStartTime(_this.originalDate);
        }

        _this.running = true;

        _this.timer = _this.options.countdown ? setInterval(countdown.bind(_this), 1000) : setInterval(stopwatch.bind(_this), 1000);
      };

      if (delay) {
        this.delayTimer = setTimeout(startFn, delay);
      } else {
        startFn();
      }

      this.emit('onStart', this);
    }

    return this;
  },


  /**
   * @description Pauses the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  pause: function pause() {
    this.clear();

    this.emit('onPause', this);

    return this;
  },


  /**
   * @description Stops the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  stop: function stop() {
    this.clear();

    this.currentTime = this.startTime;

    this.emit('onStop', this);

    return this;
  },


  /**
   * @description Clears the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  clear: function clear() {
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
  destroy: function destroy() {
    this.emit('onDestroy', this);

    this.clear().removeAllListeners();

    // removeFromStore is added when the timr is added to a store,
    // so need to check if it's in a store before removing it.
    if (typeof this.removeFromStore === 'function') {
      this.removeFromStore();
    }

    return this;
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
  ticker: makeListenerGenerator('ticker'),
  finish: makeListenerGenerator('finish'),
  onStart: makeListenerGenerator('onStart'),
  onPause: makeListenerGenerator('onPause'),
  onStop: makeListenerGenerator('onStop'),
  onDestroy: makeListenerGenerator('onDestroy'),

  /**
   * @description Converts seconds to time format.
   * This is provided to the ticker.
   *
   * @param {String} [time=currentTime] - option do format the startTime
   *
   * @return {Object} The formatted time and raw values.
   */
  formatTime: function formatTime() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return _formatTime(this[time], this.options);
  },


  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker.
   *
   * @return {Number} Time elapsed in percent.
   */
  percentDone: function percentDone() {
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
  changeOptions: function changeOptions(options) {
    var newOptions = this.startTime > 0 ? options : objectAssign({}, options, { countdown: false });

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
   * @return {Object} The original Timr object.
   */
  setStartTime: function setStartTime(startTime) {
    this.clear();

    // Coerces falsy values into 0.
    var newStartTime = 0;

    if (startTime) {
      var parsedDate = dateToSeconds(startTime);

      // Double checks parsedDate has a parsed property, in case an empty object is passed
      // in startTime.
      if ((typeof parsedDate === 'undefined' ? 'undefined' : _typeof(parsedDate)) === 'object' && parsedDate.parsed) {
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
   * @description Shorthand for this.formatTime(time).formattedTime
   */
  getFt: function getFt() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return this.formatTime(time).formattedTime;
  },


  /**
   * @description Shorthand for this.formatTime(time).raw
   */
  getRaw: function getRaw() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return this.formatTime(time).raw;
  },


  /**
   * @description Gets the Timrs startTime.
   *
   * @return {Number} Start time in seconds.
   */
  getStartTime: function getStartTime() {
    return this.startTime;
  },


  /**
   * @description Gets the Timrs currentTime.
   *
   * @return {Number} Current time in seconds.
   */
  getCurrentTime: function getCurrentTime() {
    return this.currentTime;
  },


  /**
   * @description Gets the Timrs running value.
   *
   * @return {Boolean} True if running, false if not.
   */
  isRunning: function isRunning() {
    return this.running;
  }
});

export default Timr;