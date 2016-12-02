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
    const { separator, outputFormat, formatType } = newOptions;

    // Error checking for separator.
    if (separator) {
      if (typeof separator !== 'string') {
        throw new Error(
          `Expected separator to be a string, instead got: ${typeof separator}`
        );
      }
    }

    // Error checking for outputFormat.
    if (outputFormat) {
      if (!/^(hh:)?(mm:)?ss$/i.test(outputFormat)) {
        throw new Error(
        `Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; instead got: ${outputFormat}`
        );
      }
    }

    // Error checking for formatType.
    if (formatType) {
      if (!/^[hms]$/i.test(formatType)) {
        throw new Error(
          `Expected formatType to be: h, m or s; instead got: ${formatType}`
        );
      }
    }
  }

  const defaults = {
    formatType: 'h',
    outputFormat: 'mm:ss',
    separator: ':',
    countdown: true,
  };

  return objectAssign(
    oldOptions || defaults,
    newOptions
  );
}
