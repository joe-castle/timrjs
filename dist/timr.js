/**
 * TimrJS v0.4.2
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers and NodeJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */

;(function(global) {
  'use strict';

  var
    /**
     * @description Creates a new Timr object.
     *
     * @param {String|Number} startTime - The starting time for the timr object.
     * @param {Object} [options] - Options to customise the timer.
     *
     * @returns {Object} A new Timr object.
     */
    Timr = function(startTime, options) {
      return new Timr.init(startTime, options);
    },

    /**
     * @description Checks the validity of each option passed.
     *
     * @param {String} option - The options name.
     * @param {String} value - The options value.
     *
     * @throws If the option check fails, it throws a speicifc error.
     */

    checkOption = function(option, value) {
      switch(option) {
        case 'outputFormat':
          if (typeof value !== 'string') {
            throw new TypeError(
              'Warning! outputFormat needs to be of type string, instead got: ' + value
            );
          }
          if (
            value !== 'HH:MM:SS' &&
            value !== 'MM:SS' &&
            value !== 'SS'
          ) { throw new Error('Warning! outputFormat only accepts the following: HH:MM:SS, MM:SS (default) and SS, instead got: ' + value) }
        case 'separator':
          if (typeof value !== 'string') {
            throw new TypeError(
              'Warning! separator needs to be of type string, instead got: ' + value
            );
          }
      }
    },

    /**
     * @description Builds an options object from default and custom options.
     *
     * @param {Object} options - Custom options.
     * @returns {Object} Compiled options from default and custom.
     */

    buildOptions = function(options) {
      var defaultOptions = {
        outputFormat: 'MM:SS',
        separator: ':'
      };
      if (options) {
        for (var option in options) {
          checkOption(option, options[option]);
          defaultOptions[option] = options[option];
        }
      }
      return defaultOptions;
    },

    /**
     * @description Checks the provided time for correct formatting.
     *
     * @param {String} time - The provided time string.
     * @returns {Boolean} True if format is incorrect, false otherwise.
     */
    incorrectFormat = function(time) {
      return time.split(':')
        .some(function(item, i, a) {
          if (a.length === 3 && i === 0) {
            return +item < 0 || +item > 23 || isNaN(+item);
          }
          return +item < 0 || +item > 59 || isNaN(+item);
        });
    },

    /**
     * @description Converts time format (HH:MM:SS) into seconds.
     *
     * @param {String} time - The time to be converted.
     *
     * @throws Will throw an error if the provided time is
     * incorrect format.
     *
     * @returns {Number} The converted time in seconds.
     */
    timeToSeconds = function(time) {
      if (incorrectFormat(time)) {
        throw new Error(
          'Warning! Provided time is not in the correct format. Expected time format (HH:MM:SS, MM:SS or SS), instead got: ' + time
        );
      }

      return time.split(':')
        .reduce(function(prevItem, currentItem, index, arr) {
          var hours   = prevItem + +currentItem * 60 * 60
            , minutes = prevItem + +currentItem * 60
            , seconds = prevItem + +currentItem;

          if (arr.length === 3) {
            if (index === 0) { return hours; }
            if (index === 1) { return minutes; }
          }

          if (arr.length === 2) {
            if (index === 0) { return minutes; }
          }

          return seconds;
        }, 0)
    },

    /**
     * @description Pads out single digit numbers in a string
     * with a 0 at the beginning. Primarly used for time units - 00:00:00.
     *
     * @param {String} str - String to be padded.
     * @returns {String} A 0 padded string or the the original string.
     */
    zeroPad = function(str) {
      return str.replace(/\d+/g, function(match) {
        return +match < 10 ? '0' + match : match;
      });
    },

    /**
     * @description Countdown function.
     * Bound to a setInterval timer when start() is called.
     *
     * @param {Object} self - Timr object.
     */
    countdown = function(self) {
      self.currentTime -= 1;

      self.emit('ticker', self.formatTime(), self.currentTime, self.startTime);

      if (self.currentTime <= 0) {
        self.emit('finish');
        self.stop();
      }
    },

    /**
     * @description Stopwatch function.
     * Bound to a setInterval timer when start() is called.
     *
     * @param {Object} self - Timr object.
     */
    stopwatch = function(self) {
      self.currentTime += 1;

      self.emit('ticker', self.formatTime(), self.currentTime);
    };

  Timr.prototype = {

    constructor: Timr,

    /**
     * @description Simulates Node EventEmitter on method.
     *
     * @param {String} name - The name of the event.
     * @param {Function} fn - The function to call when emitted.
     */
    on: function(name, fn) {
      if (!Array.isArray(this.events[name])) {
        this.events[name] = [];
      }

      this.events[name].push(fn);
    },

    /**
     * @description Simulates Node EventEmitter emit method.
     *
     * @param {String} name - The event to fire.
     */
    emit: function(name) {
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
    },

    /**
     * @description Starts the timr.
     *
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    start: function() {
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
    },

    /**
     * @description Pauses the timr.
     *
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    pause: function() {
      this.clear();

      return this;
    },

    /**
     * @description Stops the timr.
     *
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    stop: function() {
      this.clear();

      this.currentTime = this.startTime;

      return this;
    },

    /**
     * @description Clears the timr.
     *
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    clear: function() {
      clearInterval(this.timer);

      this.running = false;

      return this;
    },

    /**
     * @description The ticker method is called every second
     * the timer ticks down.
     *
     * As Timr simulates Node EventEmitter, this can be called
     * multiple times with different functions and each one will
     * be called when the event is emitted.
     *
     * @throws If the argument is not of type function.
     *
     * @param {Function} fn - Function to be called every second.
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    ticker: function(fn) {
      if (typeof fn !== 'function') {
        throw new TypeError(
          'Warning! Ticker requires a function, instead got: ' + typeof fn
        );
      }

      this.on('ticker', fn);

      return this;
    },

    /**
     * @description The finish method is called once when the
     * timer finishes.
     *
     * As Timr simulates Node EventEmitter, this can be called
     * multiple times with different functions and each one will
     * be called when the event is emitted.
     *
     * @throws If the argument is not of type function.
     *
     * @param {Function} fn - Function to be called when finished.
     * @return {Object} Returns the instance of Timr.
     * For possible method chaining.
     */
    finish: function(fn) {
      if (typeof fn !== 'function') {
        throw new TypeError(
          'Warning! Finish requires a function, instead got: ' + typeof fn
        );
      }

      this.on('finish', fn);

      return this;
    },

    /**
     * @description Converts seconds back to time format.
     * This is provided to the ticker method as the first argument.
     *
     * @return {String} Returns the formatted string.
     */
    formatTime: function() {
      var seconds = this.currentTime
        , minutes = seconds / 60
        , output = this.options.outputFormat
        , sep = this.options.separator;

      if (minutes >= 1) {
        var hours = minutes / 60;
        minutes = Math.floor(minutes);

        if (hours >= 1) {
          hours = Math.floor(hours);

          return zeroPad(
            hours + sep + (minutes - hours * 60) + sep + (seconds - minutes * 60)
          );
        }

        return zeroPad(
          (output === 'HH:MM:SS' ? '0' + 'sep' : '') + minutes + sep + (seconds - minutes * 60)
        );
      }

      return zeroPad(
        (output === 'HH:MM:SS' ? '0' + sep + '0' + sep : output === 'MM:SS' ? '0' + sep : '') + seconds
      );
    },

    /**
     * @description Gets the Timrs current time.
     *
     * @returns {Number} Current time in seconds
     */
    getCurrentTime: function() {
      return this.currentTime;
    },

    /**
     * @description Gets the Timrs running value.
     *
     * @returns {Boolean} True if running, false if not.
     */
    isRunning: function() {
      return this.running;
    }

  }

  /**
   * @description Creates a Timr.
   *
   * @param {String|Number} startTime - The starting time for the timr object.
   * @param {Object} [options] - Options to customise the timer.
   *
   * @throws If the provided startTime is neither a number or a string.
   */
  Timr.init = function(startTime, options) {
    if (typeof startTime === 'string') {
      startTime = timeToSeconds(startTime);
    }

    else if (typeof startTime !== 'number') {
      throw new TypeError(
        'Warning! Expected starting time to be of type string or number, instead got: ' + typeof startTime
      );
    }

    this.timer = null;
    this.events = {};
    this.running = false;
    this.options = buildOptions(options);
    this.startTime = startTime;
    this.currentTime = startTime;
  };

  // Sets new Timr objects prototype to Timrs prototype
  Timr.init.prototype = Timr.prototype;

  // Exposes Timr to global scope.
  global.Timr = Timr;

/**
 * Provides window object for a Browser enviroment.
 * Provides global object for a NodeJS enviroment.
 */
}(function() {
  try { return window; }
  catch(e) { return global; }
}()));
