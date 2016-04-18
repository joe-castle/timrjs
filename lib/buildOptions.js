'use strict';

/**
 * @description Checks the validity of each option passed.
 *
 * @param {String} option - The options name.
 * @param {String} value - The options value.
 *
 * @throws If the option check fails, it throws a speicifc error.
 *
 * @returns The provided value.
 */

const checkOption = (option, value) => {
  const errors = require('./utils/errors')(value);

  if (option === 'outputFormat') {
    if (typeof value !== 'string') {
      throw errors('outputFormatType');
    }
    if (
      value !== 'HH:MM:SS' &&
      value !== 'MM:SS' &&
      value !== 'SS'
    ) {
      throw errors('invalidOutputFormat');
    }
  }

  if (option === 'separator') {
    if (typeof value !== 'string') {
      throw errors('separatorType');
    }
  }

  return value;
};

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} options - Custom options.
 * @returns {Object} Compiled options from default and custom.
 */

module.exports = options => {
  const defaultOptions = {
    outputFormat: 'MM:SS',
    separator: ':'
  };

  for (let option in options) {
    if (options.hasOwnProperty(option)) {
      defaultOptions[option] = checkOption(option, options[option]);
    }
  }

  return defaultOptions;
};
