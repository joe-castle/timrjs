import zeroPad from './zeroPad'
import { checkType, exists, isNum, isStr } from './validate'

/**
 * @description Converts an ISO date string, or unix time into seconds until that date/time.
 *
 * @param {string|number} startTime - The ISO date string or unix time in ms.
 * @param {string|number} backupStartTime - startTime to use if provided startTime is in the past.
 *
 * @throws If the date matches the regex but is not ISO format.
 * @throws If the date is in the past.
 *
 * @return {Number} - Returns the converted seconds.
 */
function dateToSeconds (startTime: string | number, backupStartTime?: string | number): number {
  // startTime in MS from epoch.
  let parsedStartTime: number

  if (isNum(startTime)) {
    parsedStartTime = new Date(startTime).getTime()
  } else if (isStr(startTime)) {
    const error = new Error(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional as is seconds.\n' +
      `You passed: "${startTime}"`
    )

    try {
      // @ts-expect-error try catch will catch nullpointer and parseint failure
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
    throw new Error(`Expected startTime to be a string or number, instead got: ${checkType(startTime)}`)
  }

  const dateNow = new Date()

  // startTime in seconds from now, using parsedStartTime above.
  const startTimeInSeconds = Math.ceil((parsedStartTime - dateNow.getTime()) / 1000)

  if (startTimeInSeconds < 0) {
    if (exists(backupStartTime)) {
      return dateToSeconds(backupStartTime as string | number)
    }

    throw new Error(
      'When passing a date/time, it cannot be in the past. ' +
      `You passed: "${startTime}". It's currently: "` +
      `${zeroPad(dateNow.getFullYear())}-${zeroPad(dateNow.getMonth() + 1)}-` +
      `${zeroPad(dateNow.getDate())} ` +
      `${zeroPad(dateNow.getHours())}:${zeroPad(dateNow.getMinutes())}:` +
      `${zeroPad(dateNow.getSeconds())}"`
    )
  }

  return startTimeInSeconds
}

export default dateToSeconds
