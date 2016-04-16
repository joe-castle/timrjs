/**
 * TimrJS v0.6.1
 * https://github.com/joesmith100/timrjs
 * https://www.npmjs.com/package/timrjs
 *
 * Compatible with Browsers and NodeJS (CommonJS) and RequireJS.
 *
 * Copyright (c) 2016 Joe Smith
 * Released under the MIT license
 * https://github.com/joesmith100/timrjs/blob/master/LICENSE
 */

// Based off https://github.com/ForbesLindesay/umd/blob/master/template.js
;(function(Timr) {
  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Timr;

  // RequireJS
  } else if (typeof define === "function" && define.amd) {
    // Name consistent with npm module
    define('timrjs', [], function() { return Timr; });

  // <script>
  } else {
    var global;
    if (typeof window !== "undefined") {
      global = window;
    } else if (typeof global !== "undefined") {
      global = global;
    } else if (typeof self !== "undefined") {
      global = self;
    } else {
      // works providing we're not in "use strict";
      // needed for Java 8 Nashorn
      // see https://github.com/facebook/react/issues/3037
      global = this;
    }
    global.Timr = Timr;
  }
}((function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');

var createStartTime = require('./createStartTime');
var buildOptions = require('./buildOptions');
var zeroPad = require('./zeroPad');
var errors = require('./errors');

var countdown = require('./countdown');
var stopwatch = require('./stopwatch');

var removeFromStore = require('./store').removeFromStore;

/**
 * Class representing a new Timr.
 * @extends EventEmitter
 */
module.exports = function (_EventEmitter) {
  _inherits(Timr, _EventEmitter);

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
    _classCallCheck(this, Timr);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timr).call(this));

    _this.timer = null;
    _this.running = false;
    _this.options = buildOptions(options);
    _this.startTime = createStartTime(startTime);
    _this.currentTime = _this.startTime;
    return _this;
  }

  /**
   * @description Starts the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */


  _createClass(Timr, [{
    key: 'start',
    value: function start() {
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

  }, {
    key: 'pause',
    value: function pause() {
      this.clear();

      return this;
    }

    /**
     * @description Stops the timr.
     *
     * @return {Object} Returns a reference to the Timr so calls can be chained.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.clear();

      this.currentTime = this.startTime;

      return this;
    }

    /**
     * @description Clears the timr.
     *
     * @return {Object} Returns a reference to the Timr so calls can be chained.
     */

  }, {
    key: 'clear',
    value: function clear() {
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

  }, {
    key: 'destroy',
    value: function destroy() {
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

  }, {
    key: 'ticker',
    value: function ticker(fn) {
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

  }, {
    key: 'finish',
    value: function finish(fn) {
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
     * @return {String} The formatted time.
     */

  }, {
    key: 'formatTime',
    value: function formatTime() {
      var seconds = this.currentTime,
          minutes = seconds / 60,
          output = this.options.outputFormat,
          sep = this.options.separator;

      if (minutes >= 1) {
        var hours = minutes / 60;
        minutes = Math.floor(minutes);

        if (hours >= 1) {
          hours = Math.floor(hours);

          return zeroPad('' + hours + sep + (minutes - hours * 60) + sep + (seconds - minutes * 60));
        }

        return zeroPad('' + (output === 'HH:MM:SS' ? '0' + sep : '') + minutes + sep + (seconds - minutes * 60));
      }

      return zeroPad('' + (output === 'HH:MM:SS' ? '0' + sep + '0' + sep : output === 'MM:SS' ? '0' + sep : '') + seconds);
    }

    /**
     * @description Returns the time elapsed in percent.
     *
     * @returns {Number} Time elapsed in percent.
     */

  }, {
    key: 'percentDone',
    value: function percentDone() {
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
     * @return {String} Returns the startTime.
     */

  }, {
    key: 'setStartTime',
    value: function setStartTime(startTime) {
      this.clear();

      this.startTime = this.currentTime = createStartTime(startTime);

      return startTime;
    }

    /**
     * @description Gets the Timrs startTime.
     *
     * @returns {Number} Current time in seconds
     */

  }, {
    key: 'getStartTime',
    value: function getStartTime() {
      return this.startTime;
    }
    /**
     * @description Gets the Timrs currentTime.
     *
     * @returns {Number} Current time in seconds
     */

  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      return this.currentTime;
    }

    /**
     * @description Gets the Timrs running value.
     *
     * @returns {Boolean} True if running, false if not.
     */

  }, {
    key: 'isRunning',
    value: function isRunning() {
      return this.running;
    }
  }]);

  return Timr;
}(EventEmitter);

},{"./buildOptions":2,"./countdown":3,"./createStartTime":4,"./errors":5,"./stopwatch":8,"./store":9,"./zeroPad":12,"events":13}],2:[function(require,module,exports){
'use strict';

/**
 * @description Checks the validity of each option passed.
 *
 * @param {String} option - The options name.
 * @param {String} value - The options value.
 *
 * @throws If the option check fails, it throws a speicifc error.
 */

var checkOption = function checkOption(option, value) {
  var errors = require('./errors')(value);

  switch (option) {
    case 'outputFormat':
      if (typeof value !== 'string') {
        throw errors('outputFormatType');
      }
      if (value !== 'HH:MM:SS' && value !== 'MM:SS' && value !== 'SS') {
        throw errors('invalidOutputFormat');
      }
    case 'separator':
      if (typeof value !== 'string') {
        throw errors('separatorType');
      }
  }
};

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} options - Custom options.
 * @returns {Object} Compiled options from default and custom.
 */

module.exports = function (options) {
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
};

},{"./errors":5}],3:[function(require,module,exports){
'use strict';
/**
 * @description Countdown function.
 * Bound to a setInterval timer when start() is called.
 *
 * @param {Object} self - Timr object.
 */

module.exports = function (self) {
  self.currentTime -= 1;

  self.emit('ticker', self.formatTime(), self.percentDone(), self.currentTime, self.startTime, self);

  if (self.currentTime <= 0) {
    self.stop();
    self.emit('finish', self);
  }
};

},{}],4:[function(require,module,exports){
'use strict';

var timeToSeconds = require('./timeToSeconds');
var validate = require('./validate');

/**
 * @description Validates startTime and converts to seconds if a string,
 * or returns the original time in seconds.
 *
 * @param {String|Number} startTime - Starting time.
 *
 * @throws If startTime is invalid.
 *
 * @returns {Number} startTime in seconds.
 */
module.exports = function (startTime) {
  validate(startTime);
  return typeof startTime === 'number' ? startTime : timeToSeconds(startTime);
};

},{"./timeToSeconds":10,"./validate":11}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function (value) {
  return function (error) {
    return {
      outputFormatType: new TypeError('Expected outputFormat to be a string, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      invalidOutputFormat: new Error('Expected outputFormat to be: HH:MM:SS, MM:SS (default) or SS, instead got: ' + value),
      separatorType: new TypeError('Expected separator to be a string, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      invalidTime: new Error('Expected time format (HH:MM:SS, MM:SS or SS), instead got: ' + value),
      invalidTimeType: new TypeError('Expected time to be a string or number, instead got: ' + (typeof value === 'number' ? value : typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      timeOverADay: new Error('Sorry, we don\'t support any time over 23:59:59 at the moment.'),
      ticker: new TypeError('Expected ticker to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      finish: new TypeError('Expected finish to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)))
    }[error];
  };
};

},{}],6:[function(require,module,exports){
'use strict';

/**
 * @description Checks the provided time for correct formatting.
 *
 * @param {String} time - The provided time string.
 * @returns {Boolean} True if format is incorrect, false otherwise.
 */

module.exports = function (time) {
  return time.split(':').some(function (e, i, a) {
    return +e < 0 || +e > (a.length === 3 && i === 0 ? 23 : 59) || isNaN(+e);
  });
};

},{}],7:[function(require,module,exports){
'use strict';

var Timr = require('./Timr');
var store = require('./store');

/**
 * @description Creates a new Timr object.
 *
 * @param {String|Number} startTime - The starting time for the timr object.
 * @param {Object} [options] - Options to customise the timer.
 *
 * @returns {Object} A new Timr object.
 */

var init = function init(startTime, options) {
  var timr = new Timr(startTime, options);

  if (options) {
    if (options.store) {
      return store(timr);
    }
    if (options.store === false) {
      return timr;
    }
  }

  if (init.store) {
    return store(timr);
  }

  return timr;
};

// Exposed helper methods.
init.validate = require('./validate');
init.timeToSeconds = require('./timeToSeconds');
init.incorrectFormat = require('./incorrectFormat');

// Option to enable storing timrs, defaults to false.
init.store = false;

// Methods for all stored timrs.
init.destroyAll = store.destroyAll;
init.isRunning = store.isRunning;
init.startAll = store.startAll;
init.pauseAll = store.pauseAll;
init.stopAll = store.stopAll;

module.exports = init;

},{"./Timr":1,"./incorrectFormat":6,"./store":9,"./timeToSeconds":10,"./validate":11}],8:[function(require,module,exports){
'use strict';

/**
 * @description Stopwatch function.
 * Bound to a setInterval timer when start() is called.
 *
 * @param {Object} self - Timr object.
 */

module.exports = function (self) {
  self.currentTime += 1;

  self.emit('ticker', self.formatTime(), self.currentTime);
};

},{}],9:[function(require,module,exports){
'use strict';

// Array to store all timrs.

var timrs = [];

/**
 * @description A function that stores all timr objects created.
 * This feature is disabled by default, Timr.store = true to enable.
 *
 * Can also be disabled/enabled on an individual basis.
 * Each timr object accepts store as an option, true or false.
 * This overides the global Timr.store option.
 *
 * @param {Object} A timr object.
 * @returns {Object} The provided timr object.
 */
var store = function store(timr) {
  timrs.push(timr);

  return timr;
};

// Methods associated with all timrs.
store.startAll = function () {
  return timrs.forEach(function (timr) {
    return timr.start();
  });
};

store.pauseAll = function () {
  return timrs.forEach(function (timr) {
    return timr.pause();
  });
};

store.stopAll = function () {
  return timrs.forEach(function (timr) {
    return timr.stop();
  });
};

store.getAll = function () {
  return timrs;
};

store.isRunning = function () {
  return timrs.filter(function (timr) {
    return timr.isRunning();
  });
};

store.destroyAll = function () {
  timrs.forEach(function (timr) {
    return timr.destroy();
  });
  timrs = [];
};

store.removeFromStore = function (timr) {
  timrs = timrs.filter(function (x) {
    return x !== timr;
  });
};

module.exports = store;

},{}],10:[function(require,module,exports){
'use strict';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * @param {String} time - The time to be converted.
 *
 * @returns {Number} The converted time in seconds.
 */

module.exports = function (time) {
  return time.split(':').reduce(function (prevItem, currentItem, index, arr) {
    if (arr.length === 3) {
      if (index === 0) {
        return prevItem + +currentItem * 60 * 60;
      }
      if (index === 1) {
        return prevItem + +currentItem * 60;
      }
    }

    if (arr.length === 2) {
      if (index === 0) {
        return prevItem + +currentItem * 60;
      }
    }

    return prevItem + +currentItem;
  }, 0);
};

},{}],11:[function(require,module,exports){
'use strict';

var incorrectFormat = require('./incorrectFormat');

/**
 * @description Validates the provded time
 *
 * @param {String|Number} time - The time to be checked

 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time in seconds is over 23:59:59.
 *
 * @return The provided time if its valid.
 */

module.exports = function (time) {
  var errors = require('./errors')(time);

  if (typeof time === 'string') {
    if (+time < 0 || isNaN(+time) && incorrectFormat(time)) {
      throw errors('invalidTime');
    }
  } else if (typeof time !== 'number' || isNaN(time)) {
    throw errors('invalidTimeType');
  }

  if (+time > 86399) {
    throw errors('timeOverADay');
  }

  return time;
};

},{"./errors":5,"./incorrectFormat":6}],12:[function(require,module,exports){
'use strict';

/**
 * @description Pads out single digit numbers in a string
 * with a 0 at the beginning. Primarly used for time units - 00:00:00.
 *
 * @param {String} str - String to be padded.
 * @returns {String} A 0 padded string or the the original string.
 */

module.exports = function (str) {
  return str.replace(/\d+/g, function (match) {
    return +match < 10 ? '0' + match : match;
  });
};

},{}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[7])(7)));