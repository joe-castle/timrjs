'use strict';

/**
 * @description Validates startTime and converts to seconds if a string,
 * or returns the original time in seconds.
 *
 * @param {String|Number} startTime - Starting time.
 *
 * @throws If startTime is invalid.
 *
 * @returns {Number} startTime in seconds.
 */
module.exports = (startTime) => (
  require('./validate')(startTime), require('./timeToSeconds')(startTime)
);
