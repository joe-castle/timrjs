"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function store() {
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
     * @param {Object} timr - A timr object.
     *
     * @return {Object} The provided timr object.
     */
    add: function add(timr) {
      if (timrs.indexOf(timr) === -1) {
        timrs.push(timr);
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
    removeFromStore: function removeFromStore(timr) {
      timrs = timrs.filter(function (x) {
        return x !== timr;
      });
    },
    destroyAll: function destroyAll() {
      timrs.forEach(function (timr) {
        return timr.destroy();
      });
      timrs = [];
    }
  };
}();