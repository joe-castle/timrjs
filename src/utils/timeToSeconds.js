/**
 * @description Converts time format (HH:MM:SS) into seconds.
 *
 * Automatically rounds the returned number to avoid errors
 * with floating point values.
 *
 * @param {String|Number} time - The time to be converted.
 * If a number is provided it will simply return that number.
 *
 * @return {Number} - The time in seconds.
 */
export default function timeToSeconds(time) {
  if (typeof time === 'number' && !isNaN(time)) {
    return Math.round(time);
  }

  return Math.round(
    time.split(':').reduce((prev, curr, index, arr) => {
      if (arr.length === 3) {
        if (index === 0) {
          return prev + Number(curr) * 60 * 60;
        }
        if (index === 1) {
          return prev + Number(curr) * 60;
        }
      }

      if (arr.length === 2) {
        if (index === 0) {
          return prev + Number(curr) * 60;
        }
      }

      return prev + Number(curr);
    }, 0)
  );
}
