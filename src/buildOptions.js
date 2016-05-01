'use strict';

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} options - Custom options.
 * @param {Object} timr - The Timr object.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */
module.exports = (options, timr) => {
  const errors = require('./utils/errors');

  if (options) {
    let sep = options.separator;
    let outF = options.outputFormat;
    let forT = options.formatType;

    // Error checking for seperator.
    if (sep) {
      if (typeof sep !== 'string') {
        throw errors(sep)('separatorType');
      }
    }

    // Error checking for outputFormat.
    if (outF) {
      if (typeof outF !== 'string') {
        throw errors(outF)('outputFormatType');
      }
      if (!/^(hh:)?(mm:)?ss$/i.test(outF)) {
        throw errors(outF)('invalidOutputFormat');
      }
    }

    // Error checking for formatType.
    if (forT) {
      if (typeof forT !== 'string') {
        throw errors(forT)('formatType');
      }
      if (!/^[hms]$/i.test(forT)) {
        throw errors(forT)('invalidFormatType');
      }
    }
  }

  return Object.assign(
    timr.options || {formatType: 'h', outputFormat: 'mm:ss', separator: ':'},
    options
  );
};
