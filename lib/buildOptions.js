'use strict';

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
        throw new TypeError(
          `Warning! outputFormat needs to be a string, instead got a(n): ${typeof value}`
        );
      }
      if (
        value !== 'HH:MM:SS' &&
        value !== 'MM:SS' &&
        value !== 'SS'
      ) { throw `outputFormat only accepts the following:
        HH:MM:SS, MM:SS (default) and SS, instead got: ${value}` }
    case 'separator':
      if (typeof value !== 'string') {
        throw new TypeError(
          `Warning! separator needs to be a string, instead got a(n): ${value}`
        );
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
