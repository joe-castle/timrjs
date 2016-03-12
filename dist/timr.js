(function(){
  'use strict';

  /**
   * @description Object.assign polyfill
   */
  if (typeof Object.assign != 'function') {
    (function () {
      Object.assign = function (target) {
        'use strict';
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output;
      };
    })();
  }

  var errors = {
    startTime: new TypeError('Warning! the starting time needs to be a number (seconds) or a string representation of the time, e.g. 10:00. Will accept HH:MM:SS / MM:SS / SS.'),
    incorrectFormat: new Error('Provided time is not in the correct format. Expected HH:MM:SS / MM:SS / SS'),
    outputFormat: new Error('Incorrect outputFormat, expected - HH:MM:SS, MM:SS or SS')
  };

  /**
   * @description Checks the validity of each option passed.
   *
   * @param {String} The options name.
   * @param {String} The options value.
   * @throws If the option check fails, it throws a speicifc error.
   */
  function checkOption(option, value) {
    switch(option) {
      case 'outputFormat':
        if (
          value !== 'HH:MM:SS' &&
          value !== 'MM:SS' &&
          value !== 'SS'
        ) { throw errors.outputFormat }
    }
  }

  /**
   * @description
   * Builds an options object from default and custom options.
   *
   * @param {Object} Custom options.
   * @returns {Object} Compiled options from default and custom.
   */
  function buildOptions(options) {
    var defaultOptions = {
      outputFormat: 'MM:SS'
    };
    for (var option in options) {
      checkOption(option, options[option]);
    }
    return Object.assign({}, defaultOptions, options);
  }

  /**
   * @description Checks the provided time for correct formatting.
   *
   * @param {String} The provided time string.
   * @returns {Boolean} True if format is incorrect, false otherwise.
   */
  function incorrectFormat(time) {
    time = time.split(':');
    if (
      time.length === 3 && (
        (+time[0] < 0 || +time[0] > 23 || isNaN(+time[0])) ||
        (+time[1] < 0 || +time[1] > 59 || isNaN(+time[1])) ||
        (+time[2] < 0 || +time[2] > 59 || isNaN(+time[2]))
      )
    ) { return true; }
    if (
      time.length === 2 && (
        (+time[0] < 0 || +time[0] > 59 || isNaN(+time[0])) ||
        (+time[1] < 0 || +time[1] > 59 || isNaN(+time[1]))
      )
    ) { return true; }
    if (
      time.length === 1 && (
        (+time[0] < 0 || +time[1] > 59 || isNaN(+time[0]))
      )
    ) { return true; }

    return false;
  }

  /**
   * @description Converts time format (HH:MM:SS) into seconds.
   *
   * @param {String} The time to be converted.
   * @returns {Number} The converted time in seconds.
   */
  function timeToSeconds(time) {
    return time.split(':')
      .map(function(item, index, arr) {
        if (arr.length === 1) { return +item; }
        if (arr.length === 2) {
          if (index === 0) { return +item * 60; }
          return +item;
        }
        if (arr.length === 3) {
          if (index === 0) { return +item * 60 * 60; }
          if (index === 1) { return +item * 60; }
          return +item
        }
      })
      .reduce(function(a, b) { return a+b }, 0);
  }

  /**
   * @description
   * Pads out single digit numbers with a 0 at the beginning.
   * Primarly used for time units - 00:00:00.
   *
   * @param {Number} Number to be padded.
   * @returns {String} A 0 padded string or the the original
   * number as a string.
   */
  function zeroPad(num) {
    return num < 10 ? '0' + num : '' + num;
  }

  /**
   * Class representing a new Timr.
   *
   * @description Creates a Timr.
   * @param {Number} The startTime (in seconds)
   */
  function Timr(startTime, options) {
    this.timer = null;
    this.events = {};
    this.running = false;
    this.options = options;
    this.startTime = startTime;
    this.currentTime = startTime;
  }

  /**
   * @description Simulates Node EventEmitter on method.
   *
   * @param {String} The name of the event.
   * @param {Function} The function to call when emitted.
   */
  Timr.prototype.on = function(name, fn) {
    if (!Array.isArray(this.events[name])) { this.events[name] = []; }
    this.events[name].push(fn);
  }

  /**
   * @description Simulates Node EventEmitter emit method.
   *
   * @param {String} The event to fire.
   */
  Timr.prototype.emit = function(name) {
    if (!this.events[name] || this.events[name].length === 0) {
      return;
    }
    var args = [];
    for (var i = 1, j = arguments.length; i < j; i++) {
      args.push(arguments[i]);
    }
    for (var x = 0, y = this.events[name].length; x < y; x++) {
      this.events[name][x].apply(this, args);
    }
  }

  /**
   * @description Starts the timr.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  Timr.prototype.start = function() {
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
  Timr.prototype.pause = function() {
    this.clear();
    this.running = false;
    return this;
  }

  /**
   * @description Stops the timr.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  Timr.prototype.stop = function() {
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
  Timr.prototype.clear = function() {
    clearInterval(this.timer);
    return this;
  }

  /**
   * @description The ticker method is called every second
   * the timer ticks down.
   *
   * As Timr simulates Node EventEmitter, this can be called
   * multiple times with different functions and each one will
   * be called when the event is emitted.
   *
   * @param {Function} Function to be called every second.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  Timr.prototype.ticker = function(fn) {
    this.on('ticker', fn);
    return this;
  }

  /**
   * @description The finish method is called once when the
   * timer finishes.
   *
   * As Timr simulates Node EventEmitter, this can be called
   * multiple times with different functions and each one will
   * be called when the event is emitted.
   *
   * @param {Function} Function to be called when finished.
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  Timr.prototype.finish = function(fn) {
    this.on('finish', fn);
    return this;
  }

  /**
   * @description A stopwatch style counter.
   * Counts upwards, rather than down
   * @return {Object} Returns the instance of Timr.
   * For possible method chaining.
   */
  Timr.prototype.stopwatch = function() {
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
  Timr.prototype.countdown = function() {
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
  Timr.prototype.formatTime = function() {
    var seconds = this.currentTime
      , minutes = seconds / 60;
    if (minutes >= 1) {
      var hours = minutes / 60;
      minutes = Math.floor(minutes);
      if (hours >= 1) {
        hours = Math.floor(hours);
        return zeroPad(hours) + ':' + zeroPad(minutes - hours * 60) + ':' + zeroPad(seconds - minutes * 60);
      }
      return (this.options.outputFormat === 'HH:MM:SS' ? '00:' : '') + zeroPad(minutes) + ':' + zeroPad(seconds - minutes * 60);
    }
    return (this.options.outputFormat === 'HH:MM:SS' ? '00:00:' : this.options.outputFormat === 'MM:SS' ? '00:' : '') + zeroPad(seconds);
  }

  /**
   * @description Gets the Timrs current time.
   * @returns {Number} Current time in seconds
   */
  Timr.prototype.getCurrentTime = function() {
    return this.currentTime;
  }

  /**
   * @description Gets the Timrs running value.
   * @returns {Boolean} True if running, false if not.
   */
  Timr.prototype.isRunning = function() {
    return this.running
  }

  /**
   * @description Creates a new Timr object.
   *
   * @param {String} [startTime=0] The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @throws {TypeError} Will throw an error if the provided
   * argument is not of type string or number.
   *
   * @throws Will throw an error if provided option doesn't
   * meet criteria.
   *
   * @throws Will throw an error if the provided startTime is
   * incorrect format.
   *
   * @returns {Object} A new Timr object.
   */
  function init(startTime, options) {
    startTime = startTime || 0;
    if (typeof startTime === 'string') {
      if (incorrectFormat(startTime)) { throw errors.incorrectFormat; }
      return new Timr(timeToSeconds(startTime), buildOptions(options));
    }
    if (typeof startTime !== 'number') { throw errors.startTime; }
    return new Timr(startTime, buildOptions(options));
  };

  window.Timr = init;
}())
