import zeroPad from './zeroPad';
import { isNotNum } from './validate';

/**
 * @description Converts an ISO date string, or unix time into seconds until that date/time.
 *
 * @param {String|Number} startTime - The ISO date string or unix time in ms.
 *
 * @throws If the date matches the regex but is not ISO format.
 * @throws If the date is in the past.
 *
 * @return {Object|Any} - Returns the converted seconds and the original date.
 * The originalDate is used to re-run the function when the timer starts, to ensure
 * that it is up to date.
 */
export default function dateToSeconds(startTime) {
  if (!/^(\d{4}-\d{2}-\d{2})?(T\d{2}:\d{2}(:\d{2})?)?(([-+]\d{2}:\d{2})?Z?)?$/i.test(startTime) && isNotNum(startTime)) {
    throw new Error(
      'The provided date is not in the right format.\n' +
      'Expected a string in the format: YYYY-MM-DDTHH:MM:SS-01:00.\n' +
      '(year)-(month)-(day)T(hour):(minute):(second)-(timezone)\n' +
      'Time is optional, but must seperate the date with a T (exclude the T if only providing a date).\n' +
      'Seconds and the timezone are also optional.\n' +
      `You passed: "${startTime}"`,
    );
  }

  const dateNow = new Date();

  // Get startTime in MS from epoch.
  const parsedStartTime = new Date(startTime).getTime();
  // startTime in seconds from now, using parsedStartTime above.
  const startTimeInSeconds = Math.ceil((parsedStartTime - dateNow.getTime()) / 1000);

  if (isNaN(parsedStartTime)) {
    throw new Error(
      'Something went wrong parsing the date. Did you mix up the month and day?\n' +
      'Format should follow: YYYY-MM-DDTHH:MM:SS-01:00. Note: Time, seconds and timezone are optional.\n' +
      `You passed: "${startTime}".`,
    );
  }

  // TODO: Perhaps not immediatley erroring, becuase if a timer is set then once it
  // becomes in the past it will break. Or just advise a try { } catch { } ?
  if (startTimeInSeconds < 0) {
    throw new Error(
      'When passing a date/time, it cannot be in the past. ' +
      'You passed: "2015-12-25". It\'s currently: "' +
      `${zeroPad(dateNow.getFullYear())}-${zeroPad(dateNow.getMonth() + 1)}-` +
      `${zeroPad(dateNow.getDate())} ` +
      `${zeroPad(dateNow.getHours())}:${zeroPad(dateNow.getMinutes())}:` +
      `${zeroPad(dateNow.getSeconds())}"`,
    );
  }

  return startTimeInSeconds;
}
