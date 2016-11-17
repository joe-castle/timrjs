'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _EventEmitter = require('./EventEmitter');

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _buildOptions = require('./buildOptions');

var _buildOptions2 = _interopRequireDefault(_buildOptions);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _formatTime2 = require('./formatTime');

var _formatTime3 = _interopRequireDefault(_formatTime2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  _EventEmitter2.default.call(this);

  this.timer = null;
  this.running = false;
  this.startTime = (0, _validate2.default)(startTime);
  this.currentTime = this.startTime;
  this.changeOptions(options);
}

/**
 * @description Countdown function.
 * Bound to a setInterval when start() is called.
 */
Timr.countdown = function countdown() {
  this.currentTime -= 1;

  this.emit('ticker', this.formatTime(), this.percentDone(), this.currentTime, this.startTime, this);

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

  this.emit('ticker', this.formatTime(), this.currentTime, this);

  if (this.currentTime > 3599999) {
    this.stop();
    this.emit('finish', this);
  }
};

Timr.prototype = (0, _objectAssign2.default)(Object.create(_EventEmitter2.default.prototype), {

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
        _this.running = true;

        _this.timer = _this.startTime > 0 ? setInterval(Timr.countdown.bind(_this), 1000) : setInterval(Timr.stopwatch.bind(_this), 1000);
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
  pause: function pause() {
    this.clear();

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
   * from the store.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  destroy: function destroy() {
    this.clear().removeAllListeners();

    _store2.default.removeFromStore(this);

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
  ticker: function ticker(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected ticker to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
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
  finish: function finish(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected finish to be a function, instead got: ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
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
  formatTime: function formatTime() {
    var time = arguments.length <= 0 || arguments[0] === undefined ? 'currentTime' : arguments[0];

    return (0, _formatTime3.default)(this[time], this.options.separator, this.options.outputFormat, this.options.formatType);
  },


  /**
   * @description Returns the time elapsed in percent.
   * This is provided to the ticker method as the second argument.
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
   * @param {Object} options - The options to create / change.
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  changeOptions: function changeOptions(options) {
    this.options = (0, _buildOptions2.default)(options, this);

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
  setStartTime: function setStartTime(startTime) {
    this.clear();

    this.startTime = this.currentTime = (0, _validate2.default)(startTime);

    return this.formatTime();
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

exports.default = Timr;