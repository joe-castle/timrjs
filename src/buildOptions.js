const objectAssign = require('object-assign');
const invariant = require('invariant');

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
  if (options) {
    const { separator, outputFormat, formatType } = options;

    // Error checking for separator.
    if (separator) {
      invariant(
        typeof separator === 'string',
        `Expected separator to be a string, instead got: ${typeof separator}`
      );
    }

    // Error checking for outputFormat.
    if (outputFormat) {
      invariant(
        typeof outputFormat === 'string',
        `Expected outputFormat to be a string, instead got: ${typeof outputFormat}`
      );

      invariant(
        /^(hh:)?(mm:)?ss$/i.test(outputFormat),
        `Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; instead got: ${outputFormat}`
      );
    }

    // Error checking for formatType.
    if (formatType) {
      invariant(
        typeof formatType === 'string',
        `Expected formatType to be a string, instead got: ${typeof formatType}`
      );

      invariant(
        /^[hms]$/i.test(formatType),
        `Expected formatType to be: h, m or s; instead got: ${formatType}`
      );
    }
  }

  return objectAssign(
    timr.options || { formatType: 'h', outputFormat: 'mm:ss', separator: ':' },
    options
  );
};
