'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;

var _Timr = require('./Timr');

var _Timr2 = _interopRequireDefault(_Timr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description Flattens arrays to their base values
 * Example: [[1], 2, [[[3]]]] - [1, 2, 3]
 *
 * @param {Array} The array to flatten
 *
 * @return {Array} The flattened array
 */
function flattenArray(arr) {
  return arr.reduce(function (prev, curr) {
    if (Array.isArray(curr)) {
      return prev.concat(flattenArray(curr));
    }

    return prev.concat(curr);
  }, []);
}

/**
 * @description Creates a store that can store multiple timr objects
 * and perform functions on all of them.
 *
 * @param {Array} [args] - Optional timers to start the store with.
 * Can be any type, but will get filtered down to only timr objects.
 *
 * @return {Object} Returns a store object with methods.
 */
function createStore() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  // Array to store all timrs.
  // Filters out non timr objects and timrs that exist in another store.
  var timrs = flattenArray(args).filter(function (item) {
    return item instanceof _Timr2.default;
  }).filter(function (timr) {
    return typeof timr.removeFromStore !== 'function';
  });

  var removeFromStore = function removeFromStore(timr) {
    if (timr instanceof _Timr2.default) {
      timrs = timrs.filter(function (x) {
        return x !== timr;
      });
      /* eslint-disable no-param-reassign */
      timr.removeFromStore = null;
    }
  };

  // Provides each Timr with the ability to remove itself from the store.
  timrs.forEach(function (timr) {
    timr.removeFromStore = function () {
      removeFromStore(timr);
    };
  });

  return {
    /**
     * @description Adds the provided timr to the store.
     *
     * @param {Object} timr - A timr object.
     *
     * @throws If the provided timr is not a Timr object.
     * @throws If the provided timr is already in a store.
     *
     * @return {Object} The provided timr object.
     */
    add: function add(timr) {
      if (timr instanceof _Timr2.default && typeof timr.removeFromStore !== 'function') {
        timrs.push(timr);

        timr.removeFromStore = function () {
          removeFromStore(timr);
        };
        /* eslint-disable no-param-reassign */
      } else {
        throw new Error('Unable to add to store; provided argument is either already in a store ' + 'or not a timr object.');
      }

      return timr;
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
    removeFromStore: removeFromStore,
    destroyAll: function destroyAll() {
      timrs.forEach(function (timr) {
        return timr.destroy();
      });
      timrs = [];
    }
  };
}