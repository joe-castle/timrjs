import Timr from './Timr';

/**
 * @description Flattens arrays to their base values
 * Example: [[1], 2, [[[3]]]] - [1, 2, 3]
 *
 * @param {Array} The array to flatten
 *
 * @return {Array} The flattened array
 */
function flattenArray(arr) {
  return arr.reduce((prev, curr) => {
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
export default function createStore(...args) {
  // Array to store all timrs.
  // Filters out non timr objects and timrs that exist in another store.
  let timrs = flattenArray(args)
    .filter(item => item instanceof Timr)
    .filter(timr => typeof timr.removeFromStore !== 'function');

  const removeFromStore = timr => {
    if (timr instanceof Timr) {
      timrs = timrs.filter(x => x !== timr);
      /* eslint-disable no-param-reassign */
      timr.removeFromStore = null;
    }
  };

  // Provides each Timr with the ability to remove itself from the store.
  timrs.forEach(timr => {
    timr.removeFromStore = () => {
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
    add: timr => {
      if (timr instanceof Timr && typeof timr.removeFromStore !== 'function') {
        timrs.push(timr);


        timr.removeFromStore = () => {
          removeFromStore(timr);
        };
        /* eslint-disable no-param-reassign */
      } else {
        throw new Error(
          'Unable to add to store; provided argument is either already in a store ' +
          'or not a timr object.'
        );
      }

      return timr;
    },

    // Methods associated with all Timrs.
    getAll: () => timrs,
    startAll: () => timrs.forEach(timr => timr.start()),
    pauseAll: () => timrs.forEach(timr => timr.pause()),
    stopAll: () => timrs.forEach(timr => timr.stop()),
    isRunning: () => timrs.filter(timr => timr.isRunning()),
    removeFromStore,
    destroyAll: () => {
      timrs.forEach(timr => timr.destroy());
      timrs = [];
    },
  };
}
