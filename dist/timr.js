/**
 * TimrJS v0.7.0
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
      global = this;
    }
    global.Timr = Timr;
  }
}((function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var EventEmitter = require('events');

var validate = require('./validate');
var errors = require('./utils/errors');

// Factory for formatTime and formatStartTime;
function createFormatTime(time) {
  return function () {
    return require('./utils/formatTime')(this[time], this.options.separator, this.options.outputFormat);
  };
};

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
  this.options = require('./buildOptions')(options);
  this.startTime = validate(startTime);
  this.currentTime = this.startTime;
}

/**
 * @description Countdown function.
 * Bound to a setInterval timer when start() is called.
 */
Timr.countdown = function () {
  this.currentTime -= 1;

  this.emit('ticker', this.formatTime(), this.percentDone(), this.currentTime, this.startTime, this);

  if (this.currentTime <= 0) {
    this.stop();
    this.emit('finish', this);
  }
};

/**
 * @description Stopwatch function.
 * Bound to a setInterval timer when start() is called.
 */
Timr.stopwatch = function () {
  this.currentTime += 1;

  this.emit('ticker', this.formatTime(), this.currentTime, this);

  if (this.currentTime >= 3600000) {
    this.stop();
    this.emit('finish', this);
  }
};

Timr.prototype = _extends(Object.create(EventEmitter.prototype), {

  constructor: Timr,

  /**
   * @description Starts the timr.
   *
   * @return {Object} Returns a reference to the Timr so calls can be chained.
   */
  start: function start() {
    if (!this.running) {
      this.running = true;

      this.timer = this.startTime > 0 ? setInterval(Timr.countdown.bind(this), 1000) : setInterval(Timr.stopwatch.bind(this), 1000);
    } else {
      typeof console !== 'undefined' && typeof console.warn === 'function' && console.warn('Timer already running', this);
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

    require('./store').removeFromStore(this);

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
  finish: function finish(fn) {
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
   * @returns {Number} Time elapsed in percent.
   */
  percentDone: function percentDone() {
    return 100 - Math.round(this.currentTime / this.startTime * 100);
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

    this.startTime = this.currentTime = validate(startTime);

    return this.formatTime();
  },


  /**
   * @description Gets the Timrs startTime.
   *
   * @returns {Number} Current time in seconds
   */
  getStartTime: function getStartTime() {
    return this.startTime;
  },


  /**
   * @description Gets the Timrs currentTime.
   *
   * @returns {Number} Current time in seconds
   */
  getCurrentTime: function getCurrentTime() {
    return this.currentTime;
  },


  /**
   * @description Gets the Timrs running value.
   *
   * @returns {Boolean} True if running, false if not.
   */
  isRunning: function isRunning() {
    return this.running;
  }
});

module.exports = Timr;

},{"./buildOptions":2,"./store":4,"./utils/errors":5,"./utils/formatTime":6,"./validate":10,"events":11}],2:[function(require,module,exports){
'use strict';

/**
 * @description Checks the validity of each option passed.
 *
 * @param {String} option - The options name.
 * @param {String} value - The options value.
 *
 * @throws If the option check fails, it throws a speicifc error.
 *
 * @returns The provided value.
 */

var checkOption = function checkOption(option, value) {
  var errors = require('./utils/errors')(value);

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

  return value;
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

  for (var option in options) {
    defaultOptions[option] = checkOption(option, options[option]);
  }

  return defaultOptions;
};

},{"./utils/errors":5}],3:[function(require,module,exports){
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
      return store.add(timr);
    }
    if (options.store === false) {
      return timr;
    }
  }

  if (init.store) {
    return store.add(timr);
  }

  return timr;
};

// Exposed helper methods.
init.validate = require('./validate');
init.formatTime = require('./utils/formatTime');
init.timeToSeconds = require('./utils/timeToSeconds');
init.incorrectFormat = require('./utils/incorrectFormat');

// Option to enable storing timrs, defaults to false.
init.store = false;

// Methods for all stored timrs.
init.startAll = store.startAll;
init.pauseAll = store.pauseAll;
init.stopAll = store.stopAll;
init.getAll = store.getAll;
init.isRunning = store.isRunning;
init.destroyAll = store.destroyAll;
init.removeFromStore = store.removeFromStore;

module.exports = init;

},{"./Timr":1,"./store":4,"./utils/formatTime":6,"./utils/incorrectFormat":7,"./utils/timeToSeconds":8,"./validate":10}],4:[function(require,module,exports){
'use strict';

module.exports = function () {
  // Array to store all timrs.
  var timrs = [];

  return {
    /**
     * @description A function that stores all timr objects created.
     * This feature is disabled by default, Timr.store = true to enable.
     *
     * Can also be disabled/enabled on an individual basis.
     * Each timr object accepts store as an option, true or false.
     * This overides the global Timr.store option.
     *
     * @param {Object} A timr object.
     *
     * @returns {Object} The provided timr object.
     */
    add: function add(timr) {
      return timrs.push(timr), timr;
    },

    // Methods associated with all Timrs.
    getAll: function getAll() {
      return timrs;
    },
    startAll: function startAll() {
      return timrs.forEach(function (timr) {
        return timr.start();
      });
    },
    pauseAll: function pauseAll() {
      return timrs.forEach(function (timr) {
        return timr.pause();
      });
    },
    stopAll: function stopAll() {
      return timrs.forEach(function (timr) {
        return timr.stop();
      });
    },
    isRunning: function isRunning() {
      return timrs.filter(function (timr) {
        return timr.isRunning();
      });
    },
    destroyAll: function destroyAll() {
      timrs.forEach(function (timr) {
        return timr.destroy();
      });timrs = [];
    },
    removeFromStore: function removeFromStore(timr) {
      return timrs = timrs.filter(function (x) {
        return x !== timr;
      });
    }
  };
}();

},{}],5:[function(require,module,exports){
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
      timeOverADay: new Error('Sorry, we don\'t support any time over 999:59:59.'),
      ticker: new TypeError('Expected ticker to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      finish: new TypeError('Expected finish to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)))
    }[error];
  };
};

},{}],6:[function(require,module,exports){
'use strict';

var zeroPad = require('./zeroPad');

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {String} output - The format in which to output the time.
 * @param {String} sep - The character used to separate the time units.
 *
 * @return {String} The formatted time.
 */
module.exports = function (seconds, sep, output) {
  output = output || 'MM:SS';
  sep = sep || ':';

  var minutes = seconds / 60;

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
};

},{"./zeroPad":9}],7:[function(require,module,exports){
'use strict';

/**
 * @description Checks the provided time for correct formatting.
 *
 * @param {String} time - The provided time string.
 *
 * @returns {Boolean} True if format is incorrect, false otherwise.
 */

module.exports = function (time) {
  if (typeof time !== 'string') {
    return true;
  }

  time = time.split(':');

  return time.length > 3 || time.some(function (el, i, arr) {
    return isNaN(+el) || +el < 0 || +el > (arr.length === 3 && i === 0 ? 999 : 59);
  });
};

},{}],8:[function(require,module,exports){
'use strict';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * @param {String|Number} time - The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @returns {Number} - The time in seconds.
 */

module.exports = function (time) {
  if (typeof time === 'number' && !isNaN(time)) {
    return Math.round(time);
  }

  return Math.round(time.split(':').reduce(function (prev, curr, index, arr) {
    if (arr.length === 3) {
      if (index === 0) {
        return prev + +curr * 60 * 60;
      }
      if (index === 1) {
        return prev + +curr * 60;
      }
    }

    if (arr.length === 2) {
      if (index === 0) {
        return prev + +curr * 60;
      }
    }

    return prev + +curr;
  }, 0));
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

/**
 * @description Validates the provded time
 *
 * @param {String|Number} time - The time to be checked
 *
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format.
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time in seconds is over 999:59:59.
 *
 * @returns {Number} - The original number or the converted number if
 * a time string was provided.
 */

module.exports = function (time) {
  var errors = require('./utils/errors')(time);

  if (+time < 0) {
    throw errors('invalidTime');
  }

  if (typeof time === 'string') {
    if (isNaN(+time) && require('./utils/incorrectFormat')(time)) {
      throw errors('invalidTime');
    }
  } else if (typeof time !== 'number' || isNaN(time)) {
    throw errors('invalidTimeType');
  }

  if (+time > 3599999) {
    throw errors('timeOverADay');
  }

  return require('./utils/timeToSeconds')(time);
};

},{"./utils/errors":5,"./utils/incorrectFormat":7,"./utils/timeToSeconds":8}],11:[function(require,module,exports){
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

},{}]},{},[3])(3)));