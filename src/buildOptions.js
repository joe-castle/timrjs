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
    const { formatOutput, padRaw, countdown } = newOptions;

    if (formatOutput) {
      if (typeof formatOutput !== 'string') {
        throw new Error(
          'Expected formatOutput to be a string; instead got: ' +
          `${typeof formatOutput}`
        );
      }
    }

    if (padRaw) {
      if (typeof padRaw !== 'boolean') {
        throw new Error(`Expected padRaw to be a boolean; instead got: ${typeof padRaw}`);
      }
    }

    if (countdown) {
      if (typeof countdown !== 'boolean') {
        throw new Error(`Expected countdown to be a boolean; instead got: ${typeof countdown}`);
      }
    }
  }

  const defaults = {
    formatOutput: 'DD hh:{mm:ss}',
    padRaw: true,
    countdown: true,
  };

  return objectAssign(
    oldOptions || defaults,
    newOptions
  );
}
