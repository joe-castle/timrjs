import { isNum, isNotNum, isNotStr, checkType } from './validate';

/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * If a pattern is provided (25h / 25m), than
 * it is converted before being validated and processed.
 *
 * @param {String|Number} time - The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @throws If the provided time is neither a number nor a string.
 * @throws If the provided time is a negative number.
 * @throws If the provided time is not in the correct format HH:MM:SS.
 *
 * @return {Number} - The time in seconds.
 */
export default function timeToSeconds(time) {
  // If a positive number, skip processing and just return the rounded number.
  if (isNum(time) && time >= 0) return Math.round(time);

  let newTime = time;

  // Converts '25m' & '25h' into '25:00' & '25:00:00' respectivley.
  if (/^\d+[mh]$/i.test(newTime)) {
    newTime = newTime.replace(/^(\d+)m$/i, '$1:00');
    newTime = newTime.replace(/^(\d+)h$/i, '$1:00:00');
  }

  if (isNotStr(newTime) && isNotNum(newTime)) {
    throw new Error(
      `Expected time to be a string or number, instead got: ${checkType(newTime)}`,
    );
  }

  // Checks if the string can't be converted to a number, i.e someone passed 10:00.
  // Then tests for the correct format
  if (isNaN(Number(newTime))) {
    if (!/^\d+:\d+$/.test(newTime) && !/^\d+:\d+:\d+$/.test(newTime)) {
      throw new Error(`Expected time to be in (hh:mm:ss) format, instead got: ${newTime}`);
    }
  }

  if (Number(newTime) < 0) {
    throw new Error(`Time cannot be a negative number, got: ${newTime}`);
  }

  return Math.round(
    newTime.split(':').reduce((prev, curr, index, arr) => {
      if (arr.length === 3) {
        if (index === 0) return prev + (Number(curr) * 60 * 60);
        if (index === 1) return prev + (Number(curr) * 60);
      }

      if (arr.length === 2) {
        if (index === 0) return prev + (Number(curr) * 60);
      }

      return prev + Number(curr);
    }, 0),
  );
}
