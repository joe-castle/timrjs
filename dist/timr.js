/**
 * TimrJS v0.5.1
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers, NodeJS and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */

;(function() {
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
              'Expected outputFormat to be a string, instead got: ' + typeof value
            );
          }
          if (
            value !== 'HH:MM:SS' &&
            value !== 'MM:SS' &&
            value !== 'SS'
          ) { throw new Error('Expected outputFormat to be: HH:MM:SS, MM:SS (default) or SS, instead got: ' + value) }
        case 'separator':
          if (typeof value !== 'string') {
            throw new TypeError(
              'Expected separator to be a string, instead got: ' + value
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
     * @description Converts time format (HH:MM:SS) into seconds.
     *
     * @param {String} time - The time to be converted.
     *
     * @returns {Number} The converted time in seconds.
     */
    timeToSeconds = function(time) {
      return time.split(':')
        .reduce(function(prevItem, currentItem, index, arr) {
          if (arr.length === 3) {
            if (index === 0) { return prevItem + +currentItem * 60 * 60; }
            if (index === 1) { return prevItem + +currentItem * 60; }
          }

          if (arr.length === 2) {
            if (index === 0) { return prevItem + +currentItem * 60; }
          }

          return prevItem + +currentItem;
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
     * @description Checks the provided time for correct formatting.
     *
     * @param {String} time - The provided time string.
     * @returns {Boolean} True if format is incorrect, false otherwise.
     */
    incorrectFormat = function(time) {
      return time.split(':')
        .some(function(e, i, a) {
          return +e < 0 || +e > (a.length === 3 && i === 0 ? 23 : 59) || isNaN(+e);
        });
    },

    /**
     * @description Validates the provded time
     *
     * @param {String|Number} time - The time to be checked

     * @throws If the provided time is not in the correct format.
     * @throws If the provided time is neither a number nor a string.
     * @throws If the provided time in seconds is over 23:59:59.

     * @return The provided time if its valid.
     */
    validate = function(time) {
      if (typeof time === 'string') {
        if (+time < 0 || isNaN(+time) && incorrectFormat(time)) {
          throw new Error(
            'Expected time format (HH:MM:SS, MM:SS or SS), instead got: ' + time
          );
        }
      }

      else if (typeof time !== 'number' || isNaN(time)) {
        throw new TypeError(
          'Expected time to be a string or number, instead got: ' + (
            typeof time === 'number' ? time : typeof time
          )
        );
      }

      if (+time > 86399) {
        throw new Error(
          'Sorry, we don\'t support any time over 23:59:59 at the moment.'
        )
      }

      return time;
    },

    /**
     * @description Countdown function.
     * Bound to a setInterval timer when start() is called.
     *
     * @param {Object} self - Timr object.
     */
    countdown = function(self) {
      self.currentTime -= 1;

      self.emit(
        'ticker',
        self.formatTime(),
        self.percentDone(),
        self.currentTime,
        self.startTime,
        self
      );

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
          'Expected ticker to be a function, instead got: ' + typeof fn
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
          'Expected finish to be a function, instead got: ' + typeof fn
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
     * @description Returns the time elapsed in percent.
     *
     * @returns {Number} Time elapsed in percent.
     */
    percentDone: function() {
      return 100 - Math.round(this.currentTime / this.startTime * 100);
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
   * @throws If the provided startTime is neither a number or a string,
   * or, incorrect format.
   */
  Timr.init = function(startTime, options) {
    validate(startTime);

    this.timer = null;
    this.events = {};
    this.running = false;
    this.options = buildOptions(options);
    this.startTime = typeof startTime === 'number' ? startTime : timeToSeconds(startTime);;
    this.currentTime = this.startTime;
  };

  // Exposed helper methods.
  Timr.validate = validate;
  Timr.timeToSeconds = timeToSeconds;
  Timr.incorrectFormat = incorrectFormat;

  // Sets new Timr objects prototype to Timrs prototype
  Timr.init.prototype = Timr.prototype;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Timr;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define('Timr', [], function() {
      return Timr;
    });
  } else {
    window.Timr = Timr;
  }
}());
