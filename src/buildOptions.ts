import zeroPad from './zeroPad'
import { isNotNum, isNotStr, isNotBool, isFn, isObj, exists, checkType } from './validate'

import { FormatValueFn, OptionalOptions, Options, OptionsFormatValues } from './types'

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
export default function buildOptions (newOptions?: OptionalOptions, oldOptions?: Options): Options {
  const timeValues = ['ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD']

  // Run through validation first, than create the options afterwards.
  if (newOptions != null) {
    const { formatOutput, countdown, futureDate, formatValues } = newOptions

    if (exists(formatOutput) && isNotStr(formatOutput)) {
      throw new TypeError(
        'Expected formatOutput to be a string; instead got: ' +
        `${typeof formatOutput}`
      )
    }

    if (exists(countdown) && isNotBool(countdown)) {
      throw new TypeError(`Expected countdown to be a boolean; instead got: ${checkType(countdown)}`)
    }

    if (exists(futureDate) && isNotBool(futureDate)) {
      throw new TypeError(`Expected futureDate to be a boolean; instead got: ${checkType(futureDate)}`)
    }

    if (exists(formatValues)) {
      if (isFn<FormatValueFn>(formatValues)) {
        if (isNotNum(formatValues(5)) && isNotStr(formatValues(5))) {
          throw new TypeError(`Expected the return value from formatValues function to be of type string or number; instead got: ${checkType(formatValues(5))}`)
        }
      } else if (isObj<OptionsFormatValues>(formatValues)) {
        let toError = false
        let error = 'Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n'

        /**
         * Runs through each key to check that it:
         *  - Is a valid property, see timeValues above.
         *  - It's value is a function and it returns either a string or number.
         *
         * It will then create a string for all errors it finds,
         * than throw the error after its finished the loop, if any errors are found.
         */
        Object.keys(formatValues).forEach((key) => {
          const value = formatValues[key]

          if (!timeValues.includes(key)) {
            error += ` '${key}': is not a recognised property, should be one of: ${timeValues.map(val => ` '${val}'`).toString().trim()}\n`
            toError = true
          } else if (isFn<FormatValueFn>(value)) {
            if (isNotNum(value(5)) && isNotStr(value(5))) {
              error += ` '${key}': the return type for this function is not a string or number, is: ${checkType(value(5))}\n`
              toError = true
            }
          } else {
            error += ` '${key}': is not a function, is: ${checkType(value)}\n`
            toError = true
          }
        })

        if (toError) {
          throw new Error(error)
        }
      } else {
        throw new TypeError(`Expected formatValues to be a function or an object of functions; instead got: ${checkType(formatValues)}`)
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
  function makeValues (fn: OptionsFormatValues | FormatValueFn): OptionsFormatValues {
    return timeValues.reduce((obj, item) => ({
      ...obj,
      // If an object, check it's value is a function otherwise apply default (zeroPad).
      // If not object apply provided fn to all values
      [item]: isObj<OptionsFormatValues>(fn) ? (isFn(fn[item]) ? fn[item] : zeroPad) : fn
    }), {})
  }

  // Build formatValues option.
  if (newOptions != null) {
    const { formatValues } = newOptions

    if (formatValues != null) {
      let newFormatValues: OptionsFormatValues

      // If oldOptions provided, merge previous formatValues with new ones
      // Otherwise make new ones from newOptions.
      if (oldOptions != null) {
        newFormatValues = makeValues({
          ...oldOptions.formatValues,
          ...formatValues
        })
      } else {
        newFormatValues = makeValues(formatValues)
      }
      newOptions.formatValues = newFormatValues
    }
  }

  return {
    formatOutput: 'DD hh:{mm:ss}',
    countdown: true,
    // @ts-expect-error
    formatValues: makeValues(zeroPad),
    futureDate: false,
    ...oldOptions,
    ...newOptions
  }
}
