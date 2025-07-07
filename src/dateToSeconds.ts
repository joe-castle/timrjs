import { checkType, exists, isStr, isInstanceOf } from './validate'

/**
 * Confirms if provided startTime is a futureDate parseable by dateToSeconds
 *
 * @param startTime the startTime
 *
 * @return True if it is, false otherwise
 */
export function isDateFormat (startTime: string | number | Date): startTime is string | Date {
  return isInstanceOf<Date>(startTime, Date) || (isStr(startTime) && /^\d{4}-\d{2}-\d{2}/.test(startTime))
}

/**
 * Converts a date string into seconds until that date/time.
 *
 * @param startTime The date string.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 *
 * @throws If the date string is not in the correct format.
 * @throws If the date string is in the correct format but can't be parsed, for example, by using `13` for the month.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: string): number

/**
 * Converts a date object into seconds until that date/time.
 *
 * @param startTime The date object.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: Date): number

/**
 * Converts a date string into seconds until that date/time.
 *
 * @param startTime The date string.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 * @param backupStartTime startTime to use if provided startTime is in the past.
 *
 * @throws If the date string is not in the correct format.
 * @throws If the date string is in the correct format but can't be parsed, for example, by using `13` for the month.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: string, backupStartTime: string): number

/**
 * Converts a date string into seconds until that date/time.
 *
 * @param startTime The date string.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 * @param backupStartTime date to use if provided startTime is in the past.
 *
 * @throws If the date string is not in the correct format.
 * @throws If the date string is in the correct format but can't be parsed, for example, by using `13` for the month.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: string, backupStartTime: Date): number

/**
 * Converts a date object into seconds until that date/time.
 *
 * @param startTime The date object.
 * @param backupStartTime startTime to use if provided startTime is in the past.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: Date, backupStartTime: string): number

/**
 * Converts a date object into seconds until that date/time.
 *
 * @param startTime The startTime as a date object.
 * @param backupStartTime date to use if provided startTime is in the past.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: Date, backupStartTime: Date): number

/**
 * Converts a date object or date string into seconds until that date/time.
 *
 * @param startTime The date object or date string.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 * @param backupStartTime startTime string or date to use if provided startTime is in the past.
 *
 * @throws If the date string is not in the correct format.
 * @throws If the date string is in the correct format but can't be parsed, for example, by using `13` for the month.
 * @throws If the date is neither a `string` nor `Date`.
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: string | Date, backupStartTime?: string | Date): number

/**
 * Converts a date object or date string into seconds until that date/time.
 *
 * @param {string|Date} startTime The date object or date string.
 *
 * The format should be: `((year)-(month)-(day) [[(hour)]:(minute):(second(s))]`.
 * @param {string|Date} backupStartTime startTime to use if provided startTime is in the past.
 *
 * @throws If the date string is not in the correct format.
 * @throws If the date string is in the correct format but can't be parsed, for example by using `13` for the month.
 * @throws If the date is neither a `string` or `Date`.
 *
 * @return {Number} Returns the converted seconds.
 */
function dateToSeconds (startTime: string | Date, backupStartTime?: string | Date): number {
  // startTime in MS from epoch.
  let parsedStartTime: number

  if (isInstanceOf<Date>(startTime, Date)) {
    parsedStartTime = startTime.getTime()
  } else if (isStr(startTime)) {
    const error = new Error(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional and seconds is optional if time provided.\n' +
      `You passed: "${startTime}"`
    )

    try {
      // @ts-expect-error try catch will catch nullpointer failure
      const [year, month, ...rest] = startTime
        .match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/i)
        .slice(1)
        .map((value) => parseInt(value))
        .filter(Boolean)

      parsedStartTime = new Date(year, month - 1, ...rest).getTime()

      if (isNaN(parsedStartTime)) {
        throw error
      }
    } catch (err) {
      throw error
    }
  } else {
    throw new Error(`Expected startTime to be a string or Date object, instead got: ${checkType(startTime)}`)
  }

  const dateNow = new Date()

  // startTime in seconds from now, using parsedStartTime above.
  const startTimeInSeconds = Math.ceil((parsedStartTime - dateNow.getTime()) / 1000)

  if (startTimeInSeconds < 0) {
    if (exists(backupStartTime)) {
      return dateToSeconds(backupStartTime)
    }

    return 0
  }

  return startTimeInSeconds
}

export default dateToSeconds
