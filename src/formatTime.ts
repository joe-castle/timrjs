import buildOptions from './buildOptions'
import { isNotFn, isNotStr, isObj } from './validate'

import type { FormattedTime, FormatValueFn, FormatValues, OptionalOptions } from './types/common'

/**
 * Converts seconds to time format.
 *
 * @param seconds The seconds to convert.
 *
 * @return An object that that contains the `formattedTime` and the
 * `raw` values used to calculate the time.
 */
function formatTime (seconds: number): FormattedTime

/**
 * Converts seconds to time format.
 *
 * @param seconds The seconds to convert.
 * @param options The options to build the string.
 *
 * Accepts a full options object passed into `create` but only uses `formatOuput` and `formatValues`
 *
 * @return {Object} An object that that contains the `formattedTime` and the
 * `raw` values used to calculate the time.
 */
function formatTime (seconds: number, options: OptionalOptions): FormattedTime

/**
 * Converts seconds to time format.
 *
 * @param seconds The seconds to convert.
 * @param [options] The options to build the string.
 *
 * Accepts a full options object passed into `create` but only uses `formatOuput` and `formatValues`
 * @param [toBuild=true] Specifies wether to run the buildOptions function or not.
 *
 * For example, if you don't have a fully formed options object to pass in, or none at all.
 * Primarily used in `Timr#formatTime` to avoid making unnecessary calls to buildOptions on every tick.
 *
 * Setting to false will require `options.formatOuput` and `options.formatValues` to exist
 *
 * @return An object that that contains the `formattedTime` and the
 * `raw` values used to calculate the time.
 */
function formatTime (seconds: number, options?: OptionalOptions, toBuild?: boolean): FormattedTime

/**
 * Converts seconds to time format.
 *
 * @param {Number} seconds The seconds to convert.
 * @param {Object} [options] The options to build the string.
 *
 * Accepts a full options object passed into `create` but only uses `formatOuput` and `formatValues`
 * @param {Boolean} [toBuild=true] Specifies wether to run the buildOptions function or not.
 *
 * For example, if you don't have a fully formed options object to pass in, or none at all.
 * Primarily used in `Timr#formatTime` to avoid making unnecessary calls to buildOptions on every tick.
 *
 * Setting to false will require `options.formatOuput` and `options.formatValues` to exist
 *
 * @return {Object} An object that that contains the `formattedTime` and the
 * `raw` values used to calculate the time.
 */
function formatTime (seconds: number, options?: OptionalOptions, toBuild: boolean = true): FormattedTime {
  /**
   * If options doesn't exist, build regardless.
   * If it does and toBuild = true, run buildOptions
   * Otherwise just return passed in options
   */
  const { formatOutput, formatValues } = (() => {
    if (isObj<OptionalOptions>(options)) {
      if (toBuild || (isNotStr(options.formatOutput) && (isNotFn(options.formatValues)))) {
        return buildOptions(options)
      } else {
        return options
      }
    } else {
      return buildOptions()
    }
  })() as { formatOutput: string, formatValues: FormatValues }

  // @ts-expect-error
  const raw: Raw = {}
  raw.SS = seconds
  raw.MM = Math.floor(raw.SS / 60)
  raw.HH = Math.floor(raw.MM / 60)
  raw.DD = Math.floor(raw.HH / 24)
  raw.ss = Math.floor(seconds % 60)
  raw.mm = Math.floor(raw.MM % 60)
  raw.hh = Math.floor(raw.HH % 24)
  raw.dd = raw.DD

  let stringToFormat = formatOutput

  const leftBracketPosition = stringToFormat.lastIndexOf('{') + 1
  const rightBracketPosition = stringToFormat.indexOf('}')

  /**
   * Get values sitting in-between { } (protectedValues)
   * Match returns empty strings for groups it can't find so filter them out.
   */
  const protectedValues = stringToFormat
    .slice(leftBracketPosition, rightBracketPosition)
    .match(/DD|HH|MM|SS/gi)

  // If protectedValues exist, apply logic to removing them
  // otherwise, format string exactly as it appears
  if (protectedValues != null) {
    let lastValueAboveZero
    if (raw.DD > 0) lastValueAboveZero = 'DD'
    else if (raw.HH > 0) lastValueAboveZero = 'HH'
    else if (raw.MM > 0) lastValueAboveZero = 'MM'
    else lastValueAboveZero = 'SS'

    /**
     * If the lastValueAboveZero is inbetween the protectedValues than don't remove them.
     * E.G. starting string: HH:{mm:ss} and lastValueAboveZero is 'ss' than begin slice
     * at leftBracketPosition rather than beginning at ss.
     */
    const tempSlice = stringToFormat.search(new RegExp(lastValueAboveZero, 'ig'))
    const beginSlice = tempSlice >= leftBracketPosition ? leftBracketPosition : tempSlice

    stringToFormat = stringToFormat.slice(beginSlice >= 0 ? beginSlice : 0)
  }

  // Replaces all values in string with their respective number values
  const formattedTime = stringToFormat
    // Remove any remaining curly braces before formatting.
    .replace(/\{|\}/g, '')
    // Apply specific function form formatValues to value.
    .replace(/DD|HH|MM|SS/gi, (match) => (formatValues[match] as FormatValueFn)(raw[match]) as string)

  return { formattedTime, raw }
}

export default formatTime
