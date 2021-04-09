
import zeroPad from './zeroPad'
import { checkType, exists, isStr, isInstanceOf } from './validate'

/**
 * @description Confirms if provided startTime is a futureDate parseable by dateToSeconds
 *
 * @param startTime the startTime
 *
 * @returns True if it is, false otherwise
 */
export function isDateFormat (startTime: string | number | Date): startTime is string | Date {
  return isInstanceOf<Date>(startTime, Date) || (isStr(startTime) && /^\d{4}-\d{2}-\d{2}/.test(startTime))
}

/**
 * @description Converts a date object or date string into seconds until that date/time.
 *
 * @param {string|number} startTime - The date object or date string.
 * @param {string|number} backupStartTime - startTime to use if provided startTime is in the past.
 *
 * @throws If the date matches the regex but is not the correct format.
 * @throws If the date is in the past.
 *
 * @return {Number} - Returns the converted seconds.
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

    throw new Error(
      'When passing a date/time, it cannot be in the past. ' +
      `You passed: "${startTime as string}". It's currently: "` +
      `${zeroPad(dateNow.getFullYear())}-${zeroPad(dateNow.getMonth() + 1)}-` +
      `${zeroPad(dateNow.getDate())} ` +
      `${zeroPad(dateNow.getHours())}:${zeroPad(dateNow.getMinutes())}:` +
      `${zeroPad(dateNow.getSeconds())}"`
    )
  }

  return startTimeInSeconds
}

export default dateToSeconds
