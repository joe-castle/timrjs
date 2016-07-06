const invariant = require('invariant');

/**
 * @description A wrapper around invariant to remove errors in production
 *
 * @param {Boolean} condition - The invariant condition
 * @param {String} format - The invariant message
 *
 * @throws If the condition is falsy
 */
function invariantWrapped(condition, format) {
  (process.env.NODE_ENV === 'production' ? invariant(
    condition, format
  ) : invariant(condition))
}

module.exports = invariantWrapped;
