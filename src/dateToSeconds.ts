import { checkType, exists, isStr, isInstanceOf } from './validate'
import { parseISO } from 'date-fns/parseISO'

/**
 * Confirms if provided startTime is a futureDate parseable by dateToSeconds
 *
 * @param startTime the startTime
 *
 * @return True if it is, false otherwise
 */
export function isDateFormat (startTime: string | number | Date): startTime is string | Date {
  return isInstanceOf<Date>(startTime, Date) || (isStr(startTime) && parseISO(startTime).toString() !== 'Invalid Date')
}

/**
 * Converts a date string into seconds until that date/time.
 *
 * @param startTime The date string.
 *
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: Date): number

/**
 * Converts a date string into seconds until that date/time.
 *
 * @param startTime The date string.
 *
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
 *
 * @return Returns the converted seconds.
 */
function dateToSeconds (startTime: Date, backupStartTime: Date): number

/**
 * Converts a date object or date string into seconds until that date/time.
 *
 * @param startTime The date object or date string.
 *
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
 * The string should be in ISO8601 format, be parseable by `date-fns/parseISO`. See {@link https://date-fns.org/v4.1.0/docs/parseISO}
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
    const date = parseISO(startTime)

    if (date.toString() === 'Invalid Date') {
      throw new Error('Provided startTime is not parseable by "date-fns/parseISO"')
    }

    parsedStartTime = date.getTime()
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
