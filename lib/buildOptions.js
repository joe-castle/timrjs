var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import objectAssign from 'object-assign';

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} [newOptions] - Optional custom options.
 * @param {Object} [oldOptions] - Optional previous options.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */
export default function buildOptions(newOptions, oldOptions) {
  if (newOptions) {
    var formatOutput = newOptions.formatOutput;
    var padRaw = newOptions.padRaw;
    var countdown = newOptions.countdown;


    if (formatOutput) {
      if (typeof formatOutput !== 'string') {
        throw new Error('Expected formatOutput to be a string; instead got: ' + ('' + (typeof formatOutput === 'undefined' ? 'undefined' : _typeof(formatOutput))));
      }
    }

    if (padRaw) {
      if (typeof padRaw !== 'boolean') {
        throw new Error('Expected padRaw to be a boolean; instead got: ' + (typeof padRaw === 'undefined' ? 'undefined' : _typeof(padRaw)));
      }
    }

    if (countdown) {
      if (typeof countdown !== 'boolean') {
        throw new Error('Expected countdown to be a boolean; instead got: ' + (typeof countdown === 'undefined' ? 'undefined' : _typeof(countdown)));
      }
    }
  }

  var defaults = {
    formatOutput: 'DD hh:{mm:ss}',
    padRaw: true,
    countdown: true
  };

  return objectAssign(oldOptions || defaults, newOptions);
}