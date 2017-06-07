import objectAssign from 'object-assign';
import zeroPad from './zeroPad';
import { isNotNum, isNotStr, isNotBool, isFn, isObj, exists, checkType } from './validate';

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
  const timeValues = ['ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD'];

  // Run through validation first, than create the options afterwards.
  if (newOptions) {
    const { formatOutput, countdown, futureDate, formatValues } = newOptions;

    if (exists(formatOutput) && isNotStr(formatOutput)) {
      throw new Error(
        'Expected formatOutput to be a string; instead got: ' +
        `${typeof formatOutput}`,
      );
    }

    if (exists(countdown) && isNotBool(countdown)) {
      throw new Error(`Expected countdown to be a boolean; instead got: ${checkType(countdown)}`);
    }

    if (exists(futureDate) && isNotBool(futureDate)) {
      throw new Error(`Expected futureDate to be a boolean; instead got: ${checkType(futureDate)}`);
    }

    if (exists(formatValues)) {
      if (isFn(formatValues)) {
        if (isNotNum(formatValues(5)) && isNotStr(formatValues(5))) {
          throw new Error(`Expected the return value from formatValues function to be of type string or number; instead got: ${checkType(formatValues(5))}`);
        }
      } else if (isObj(formatValues)) {
        let toError = false;
        let error = 'Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n';

        /**
         * Runs throught each key to check that it:
         *  - Is a valid property, see timeValues above.
         *  - It's value is a function and it returns either a string or number.
         *
         * It will then create a string for all errors it finds,
         * than throw the error after its finished the loop, if any errros are found.
         */
        Object.keys(formatValues).forEach((key) => {
          const value = formatValues[key];

          if (!timeValues.includes(key)) {
            error += ` '${key}': is not a recognised property, should be one of: ${timeValues.map(val => ` '${val}'`).toString().trim()}\n`;
            toError = true;
          } else if (isFn(value)) {
            if (isNotNum(value(5)) && isNotStr(value(5))) {
              error += ` '${key}': the return type for this function is not a string or number, is: ${checkType(value(5))}\n`;
              toError = true;
            }
          } else {
            error += ` '${key}': is not a function, is: ${checkType(value)}\n`;
            toError = true;
          }
        });

        if (toError) throw new Error(error);
      } else {
        throw new Error(`Expected formatValues to be a function or an object of functions; instead got: ${checkType(formatValues)}`);
      }
    }
  }

  /**
   * @description Creates an object using the provided function / object of functions
   * and assigns it to all or their respective values.
   *
   * @param {Function|Object} fn - The function or object of functions to assign to the time values.
   *
   * @return {Object} - The created object of functions.
   */
  function makeValues(fn) {
    return timeValues.reduce((obj, item) => ({
      ...obj,
      // If an object, check it's value is a function otherwise apply default (zeroPad).
      // If not object apply provided fn to all values.
      /* eslint-disable no-nested-ternary */
      [item]: isObj(fn) ? (isFn(fn[item]) ? fn[item] : zeroPad) : fn,
    }), {});
  }

  // Build formatValues option.
  if (newOptions) {
    const { formatValues } = newOptions;

    if (formatValues) {
      let newFormatValues;

      // If oldOptions provided, merge previous formatValues with new ones
      // Otherwise make new ones from newOptions.
      if (oldOptions) {
        newFormatValues = makeValues(
          objectAssign({}, oldOptions.formatValues, formatValues),
        );
      } else {
        newFormatValues = makeValues(formatValues);
      }
      // eslint-disable-next-line
      newOptions.formatValues = newFormatValues;
    }
  }

  const defaults = {
    formatOutput: 'DD hh:{mm:ss}',
    countdown: true,
    formatValues: makeValues(zeroPad),
    futureDate: false,
  };

  return objectAssign(defaults, oldOptions, newOptions);
}
