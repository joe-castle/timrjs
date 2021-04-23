import { Events, Listener } from './types/common'
import { exists, notExists } from './validate'

/**
 * Creates an EventEmitter.
 *
 * This is a super slimmed down version of nodes EventEmitter.
 *
 * This is only intended for internal use, as there is
 * no real error checking.
 */
class EventEmitter {
  events: Events

  constructor () {
    this.events = {}
  }

  /**
   * Registers a listener to an event array.
   *
   * @param event The event to attach to.
   * @param listener The event listener.
   */
  on (event: string, listener: Listener): void {
    if (notExists(this.events[event])) {
      this.events[event] = []
    }

    this.events[event].push(listener)
  }

  /**
   * Emits an event, calling all listeners store
   * against the provided event.
   *
   * @param event The event to emit.
   * @param args The functions to run against the event.
   */
  emit (event: string, ...args: any[]): void {
    if (exists(this.events[event])) {
      this.events[event].forEach((listener) => {
        listener.apply(this, args)
      })
    }
  }

  /**
   * Removes all listeners.
   */
  removeAllListeners (): void {
    this.events = {}
  }
}

export default EventEmitter
