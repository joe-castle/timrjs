import { isNum, isNotNum, isNotStr, checkType, isStr } from './validate'

/**
 * Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * If a pattern is provided (25h / 25m / 25d), than
 * it is converted before being validated and processed.
 *
 * @param time The time to be converted.
 *
 * @throws If the provided time is not a string.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @return The time in seconds.
 */
function timeToSeconds (time: string): number

/**
 * Converts time format (HH:MM:SS) into seconds.
 *
 * @param time The time to be converted
 *
 * @throws If the provided time is a negative number.
 *
 * @return The provided number, rounded.
 */
function timeToSeconds (time: number): number

/**
 * Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * If a pattern is provided (25h / 25m / 25d), than
 * it is converted before being validated and processed.
 *
 * @param time The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @return The time in seconds.
 */
function timeToSeconds (time: string | number): number

/**
 * Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * If a pattern is provided (25h / 25m / 25d), than
 * it is converted before being validated and processed.
 *
 * @param {string|number} time The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @return {number} The time in seconds.
 */
function timeToSeconds (time: string | number): number {
  // If a positive number, skip processing and just return the rounded number.
  if (isNum(time) && time >= 0) return Math.round(time)

  let newTime = time

  // Converts '25m', '25h' && '25d' into '25:00', '25:00:00' & '600:00:00' respectivley.
  if (isStr(newTime) && /^\d+[mhd]$/i.test(newTime)) {
    switch (newTime.slice(-1)) {
      case 'm': newTime = newTime.replace(/^(\d+)m$/i, '$1:00'); break
      case 'h': newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00'); break
      case 'd': newTime = newTime.replace(/^(\d+)d$/i, (m, g1) => `${parseInt(g1) * 24}:00:00`); break
    }
  }

  if (isNotStr(newTime) && isNotNum(newTime)) {
    throw new TypeError(
      `Expected time to be a string or number, instead got: ${checkType(newTime)}`
    )
  }

  // Checks if the string can't be converted to a number, i.e someone passed 10:00.
  // Then tests for the correct format
  if (isNaN(Number(newTime)) && isStr(newTime)) {
    if (!/^(\d+)(:\d+)?(:\d+)?$/.test(newTime)) {
      throw new SyntaxError(`Expected time to be in (hh:mm:ss) format, instead got: ${newTime}`)
    }
  }

  if (Number(newTime) < 0) {
    throw new Error(`Time cannot be a negative number, got: ${newTime}`)
  }

  return Math.round(
    (newTime as string).split(':').reduce((prev, curr, index, arr) => {
      if (arr.length === 3) {
        if (index === 0) return prev + (Number(curr) * 60 * 60)
        if (index === 1) return prev + (Number(curr) * 60)
      }

      if (arr.length === 2) {
        if (index === 0) return prev + (Number(curr) * 60)
      }

      return prev + Number(curr)
    }, 0)
  )
}

export default timeToSeconds
