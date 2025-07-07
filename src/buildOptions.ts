import zeroPad from './zeroPad'
import { isNotNum, isNotStr, isNotBool, isFn, isObj, exists, checkType } from './validate'

import type { FormatValueFn, FormatValues, OptionalOptions, Options, OptionsFormatValues } from './types/common'

const optionsFormatKeys = ['default', 'ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD']
const timeValues = optionsFormatKeys.slice(1)

/**
 * Creates an object using the provided object of functions
 * and assigns it to all or their respective values.
 *
 * @param {Object} formatValues - The object of functions to assign to the time values.
 *
 * @return {Object} - The created object of functions.
 */
function makeValues (formatValues: OptionsFormatValues): FormatValues {
  return timeValues.reduce((obj, item) => ({
    ...obj,
    [item]: exists(formatValues[item]) ? formatValues[item] : exists(formatValues.default) ? formatValues.default : zeroPad
  }), {})
}

/**
 * Builds an options object from default and custom options.
 *
 * @param {Object} [newOptions] - Optional custom options.
 * @param {Object} [oldOptions] - Optional previous options.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */
function buildOptions (newOptions?: OptionalOptions, oldOptions?: Options): Options {
  // Run through validation first, than create the options afterwards.
  if (exists(newOptions)) {
    const { formatOutput, countdown, formatValues } = newOptions

    if (exists(formatOutput) && isNotStr(formatOutput)) {
      throw new TypeError(`Expected formatOutput to be a string; instead got: ${checkType(formatOutput)}`)
    }

    if (exists(countdown) && isNotBool(countdown)) {
      throw new TypeError(`Expected countdown to be a boolean; instead got: ${checkType(countdown)}`)
    }

    if (exists(formatValues)) {
      if (isObj<OptionsFormatValues>(formatValues)) {
        let toError = false
        let error = 'Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n'

        /**
         * Runs through each key to check that it:
         *  - Is a valid property, see optionsFormatKeys above.
         *  - It's value is a function and it returns either a string or number.
         *
         * It will then create a string for all errors it finds,
         * than throw the error after its finished the loop, if any errors are found.
         */
        Object.keys(formatValues).forEach((key) => {
          const value = formatValues[key]

          if (!optionsFormatKeys.includes(key)) {
            error += ` '${key}': is not a recognised property, should be one of: ${optionsFormatKeys.map(val => ` '${val}'`).toString().trim()}\n`
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
        throw new TypeError(`Expected formatValues to be a an object of functions; instead got: ${checkType(formatValues)}`)
      }
    }
  }

  // Build formatValues option.
  if (exists(newOptions)) {
    const { formatValues } = newOptions

    if (exists(formatValues)) {
      let newFormatValues: FormatValues

      // If oldOptions provided, merge previous formatValues with new ones
      // Otherwise make new ones from newOptions.
      if (exists(oldOptions)) {
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
    formatValues: makeValues({ }),
    ...oldOptions,
    ...newOptions
  }
}

export default buildOptions
