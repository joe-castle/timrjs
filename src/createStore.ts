import Timr from './Timr'
import { isNotFn } from './validate'

import { Status, Store } from './types'

/**
 * @description Flattens arrays to their base values
 * Example: [[1], 2, [[[3]]]] - [1, 2, 3]
 *
 * @param {Array} arr - The array to flatten
 *
 * @return {Array} The flattened array
 */
function flattenArray<T> (arr: T[]): T[] {
  return arr.reduce((prev: T[], curr: T) => {
    if (Array.isArray(curr)) {
      return prev.concat(flattenArray(curr))
    }

    return prev.concat(curr)
  }, [])
}

/**
 * @description Creates a store that can hold multiple timr objects
 * and perform functions on all of them.
 *
 * @param {Array} [args] - Optional timers to start the store with.
 * @throws If the provided timr is not a Timr object.
 * @throws If the provided timr is already in a store.
 *
 * @return {Object} Returns a store object with methods.
 */
export default function createStore (...args: Timr[]): Store {
  let timrs: Timr[] = []

  function removeFromStore (timr: Timr): void {
    // Instanceof check required as it's exposed as a store method.
    if (timr instanceof Timr) {
      timrs = timrs.filter(x => x !== timr)
      timr.removeFromStore = null
    }
  }

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
  function add (timr: Timr): Timr {
    if (timr instanceof Timr && isNotFn(timr.removeFromStore)) {
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

  // Flatten args down to their values and add them to the store
  // if they pass validation.
  flattenArray(args).forEach(add)

  return {
    add,
    getAll: () => timrs,
    startAll: () => timrs.forEach(timr => timr.start()),
    pauseAll: () => timrs.forEach(timr => timr.pause()),
    stopAll: () => timrs.forEach(timr => timr.stop()),
    getStatus: (statusName: Status) => timrs.filter(timr => timr.getStatus(statusName)),
    // Deprecated in favour of .started()
    isRunning: () => timrs.filter(timr => timr.isRunning()),
    started: () => timrs.filter(timr => timr.started()),
    removeFromStore,
    destroyAll: () => {
      timrs.forEach(timr => timr.destroy())
      timrs = []
    }
  }
}
