'use strict';

/**
 * @description Creates an EventEmitter.
 *
 * This is a super slimmed down version of nodes EventEmitter.
 *
 * This is only intended for internal use, as there is
 * no real error checking.
 */
function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype = {

  constructor: EventEmitter,

  /**
   * @description Registers a listener to an event array.
   *
   * @param {String} event - The event to attach to.
   * @param {Function} listener - The event listener.
   */
  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push(listener);
  },

  /**
   * @description Emits an event, calling all listeners store
   * against the provided event.
   *
   * @param {String} event - The event to emit.
   */
  emit(event) {
    if (this._events[event]) {
      this._events[event].forEach(listener => {
        listener.apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      });
    }
  },

  /**
   * @description Removes all listeners.
   */
  removeAllListeners() {
    this._events = {};
  }
};

module.exports = EventEmitter;
