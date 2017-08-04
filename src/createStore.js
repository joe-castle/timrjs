import Timr from './Timr'
import { isNotFn } from './validate'

/**
 * @description Flattens arrays to their base values
 * Example: [[1], 2, [[[3]]]] - [1, 2, 3]
 *
 * @param {Array} arr - The array to flatten
 *
 * @return {Array} The flattened array
 */
function flattenArray (arr) {
  return arr.reduce((prev, curr) => {
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
 * Can be any type, but will get filtered down to only timr objects.
 *
 * @return {Object} Returns a store object with methods.
 */
export default function createStore (...args) {
  let timrs = []

  function removeFromStore (timr) {
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
  function add (timr) {
    if (timr instanceof Timr && isNotFn(timr.removeFromStore)) {
      timrs.push(timr)

      timr.removeFromStore = () => {
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
    isRunning: () => timrs.filter(timr => timr.isRunning()),
    removeFromStore,
    destroyAll: () => {
      timrs.forEach(timr => timr.destroy())
      timrs = []
    }
  }
}
