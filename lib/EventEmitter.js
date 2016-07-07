"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @description Creates an EventEmitter.
 *
 * This is a super slimmed down version of nodes EventEmitter.
 *
 * This is only intended for internal use, as there is
 * no real error checking.
 */
function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype = {

  constructor: EventEmitter,

  /**
   * @description Registers a listener to an event array.
   *
   * @param {String} event - The event to attach to.
   * @param {Function} listener - The event listener.
   */
  on: function on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  },


  /**
   * @description Emits an event, calling all listeners store
   * against the provided event.
   *
   * @param {String} event - The event to emit.
   */
  emit: function emit(event) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (this.events[event]) {
      this.events[event].forEach(function (listener) {
        listener.apply(_this, args);
      });
    }
  },


  /**
   * @description Removes all listeners.
   */
  removeAllListeners: function removeAllListeners() {
    this.events = {};
  }
};

exports.default = EventEmitter;