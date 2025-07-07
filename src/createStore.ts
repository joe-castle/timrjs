import Timr from './Timr'
import { isInstanceOf, isNotFn } from './validate'

import type { Store } from './types/common'
import type { Status } from './types/enums'
import type { ITimr } from './types/ITimr'

/**
 * Creates a store that can hold multiple Timr objects
 * and perform functions on all of them.
 *
 * @param {Array} [args] - Optional timers to start the store with.
 *
 * @throws If the provided Timr is not a Timr object.
 * @throws If the provided Timr is already in a store.
 *
 * @return {Object} Returns a store object with methods.
 */
function createStore (...args: ITimr[]): Store {
  let timrs: ITimr[] = []

  /**
   * Removes the provided Timr from the store
   *
   * @param {Object} timr The Timr to remove
   */
  function removeFromStore (timr: ITimr): void {
    // Instanceof check required as it's exposed as a store method.
    if (isInstanceOf(timr, Timr)) {
      timrs = timrs.filter(x => x !== timr)
      timr.removeFromStore = null
    }
  }

  /**
   * Adds the provided Timr to the store.
   *
   * @param {Object} timr A Timr object.
   *
   * @throws If the provided Timr is not a Timr object.
   * @throws If the provided timer is already in a store.
   *
   * @return {Object} The provided Timr object.
   */
  function add (timr: ITimr): ITimr {
    if (isInstanceOf(timr, Timr) && isNotFn(timr.removeFromStore)) {
      timrs.push(timr)

      timr.removeFromStore = (): void => {
        removeFromStore(timr)
      }
    } else {
      throw new Error(
        'Unable to add to store; provided argument is either already in a store ' +
        'or not a timr object.'
      )
    }

    return timr
  }

  args.forEach(add)

  return {
    add,

    /**
     * Returns an array of all the timers in the store.
     *
     * @return {Array} The array of Timrs.
     */
    getAll () {
      return timrs
    },

    /**
     * Starts all the timers in the store.
     */
    startAll () {
      timrs.forEach(timr => timr.start())
    },

    /**
     * Pauses all the timers in the store.
     */
    pauseAll () {
      timrs.forEach(timr => timr.pause())
    },

    /**
     * Stops all the timers in the store.
     */
    stopAll () {
      timrs.forEach(timr => timr.stop())
    },

    /**
     * Returns an array of all the timers that are in the same status
     * as the one provided.
     *
     * @param {string} statusName The status to check.
     *
     * @return {Array} An array of timers that are in a state matched by the provided `statusName`
     */
    getStatus (statusName: Status) {
      return timrs.filter(timr => timr.getStatus(statusName))
    },

    /**
     * Returns an array of timers that are currently running.
     *
     * @deprecated Please use `started()` instead
     *
     * @return {Array} The array of running Timrs
     */
    isRunning () {
      return timrs.filter(timr => timr.isRunning())
    },

    /**
     * Returns an array of timers that have started.
     *
     * @return {Array} The array of Timrs that have started
     */
    started () {
      return timrs.filter(timr => timr.started())
    },

    removeFromStore,

    /**
     * Destroys all Timrs in the store
     */
    destroyAll () {
      timrs.forEach(timr => timr.destroy())
      timrs = []
    }
  }
}

export default createStore
