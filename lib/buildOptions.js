'use strict';

const errors = require('./errors');

/**
 * @description Checks the validity of each option passed.
 *
 * @param {String} The options name.
 * @param {String} The options value.
 * @throws If the option check fails, it throws a speicifc error.
 */

const checkOption = (option, value) => {
  switch(option) {
    case 'outputFormat':
      if (typeof value !== 'string') {
        throw errors(typeof value).outputFormat;
      }
      if (
        value !== 'HH:MM:SS' &&
        value !== 'MM:SS' &&
        value !== 'SS'
      ) { throw errors(value).outputFormat }
    case 'separator':
      if (typeof value !== 'string') {
        throw errors(typeof value).separator;
      }
  }
};

/**
 * @description
 * Builds an options object from default and custom options.
 *
 * @param {Object} Custom options.
 * @returns {Object} Compiled options from default and custom.
 */

module.exports = (options) => {
  const defaultOptions = {
    outputFormat: 'MM:SS',
    separator: ':'
  };
  for (let option in options) {
    checkOption(option, options[option]);
  }
  return Object.assign({}, defaultOptions, options);
};
