'use strict';

/**
 * @description Factory function for formatTime and formatStartTime
 *
 * @param {String} time - Either 'currentTime' or 'startTime'
 *
 * @return {Function} Formattime function closed over above value.
 */
module.exports = time => (
  function() {
    return require('./utils/formatTime')(
      this[time],
      this.options.separator,
      this.options.outputFormat
    );
  }
);
