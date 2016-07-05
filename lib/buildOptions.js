'use strict';

var errors = require('./utils/errors');
var objectAssign = require('object-assign');

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
module.exports = function (options, timr) {
  if (options) {
    var sep = options.separator;
    var outF = options.outputFormat;
    var forT = options.formatType;

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

  return objectAssign(timr.options || { formatType: 'h', outputFormat: 'mm:ss', separator: ':' }, options);
};