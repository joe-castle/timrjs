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
  on(event, listener) {
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
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        listener.apply(this, args);
      });
    }
  },

  /**
   * @description Removes all listeners.
   */
  removeAllListeners() {
    this.events = {};
  },
};

export default EventEmitter;
