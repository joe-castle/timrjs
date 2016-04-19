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
    let out = options.outputFormat;
    let sep = options.separator;

    if (out) {
      if (typeof out !== 'string') {
        throw errors(out)('outputFormatType');
      }
      if (
        out !== 'HH:MM:SS' &&
        out !== 'MM:SS' &&
        out !== 'SS'
      ) {
        throw errors(out)('invalidOutputFormat');
      }
    }
    if (sep) {
      if (typeof sep !== 'string') {
        throw errors(sep)('separatorType');
      }
    }
  }

  return Object.assign({outputFormat: 'MM:SS', separator: ':'}, options);
};
