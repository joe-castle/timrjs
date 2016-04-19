'use strict';

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} options - Custom options.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */

module.exports = options => {
  const errors = require('./utils/errors');

  if (options) {
    let outF = options.outputFormat;
    let forT = options.formatType;
    let sep = options.separator;

    if (outF) {
      if (typeof outF !== 'string') {
        throw errors(outF)('outputFormatType');
      }
      if (!/^(HH:)?(MM:)?SS$/i.test(outF)) {
        throw errors(outF)('invalidOutputFormat');
      }
    }

    if (sep) {
      if (typeof sep !== 'string') {
        throw errors(sep)('separatorType');
      }
    }

    if (forT) {
      if (typeof forT !== 'string') {
        throw errors(forT)('formatType');
      }
      if (!/^[hms]$/i.test(forT)) {
        throw errors(forT)('invalidFormatType')
      }
    }
  }

  return Object.assign(
    {formatType: 'h', outputFormat: 'MM:SS', separator: ':'},
    options
  );
};
