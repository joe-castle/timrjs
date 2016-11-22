import buildOptions from './buildOptions';

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {Object} [options] - The options to build the string.
 *
 * @return {String} The formatted time.
 */
export default function formatTime(seconds, options) {
  const { outputFormat, formatType, separator } = buildOptions(options);

  /**
   * @description Creates a timestring.
   * Created inside formatTime to have access to separator argument,
   *
   * @param {Array} [...args] - All arguments to be processed
   *
   * @return {String} The compiled time string.
   */
  const createTimeString = function createTimeString(...args) {
    return args
      .filter(value => value !== false)
      .map(value => (value < 10 ? `0${value}` : value))
      .join(separator);
  };

  if (formatType === 's') {
    return `${seconds}`;
  }

  let minutes = seconds / 60;

  if (minutes >= 1 && /[hm]/i.test(formatType)) {
    let hours = minutes / 60;
    minutes = Math.floor(minutes);

    if (hours >= 1 && /[h]/i.test(formatType)) {
      hours = Math.floor(hours);

      return createTimeString(
        hours,
        minutes - hours * 60,
        seconds - minutes * 60
      );
    }

    return createTimeString(
      /HH:MM:SS/i.test(outputFormat) && 0,
      minutes,
      seconds - minutes * 60
    );
  }

  return createTimeString(
    /HH:MM:SS/i.test(outputFormat) && 0,
    /MM:SS/i.test(outputFormat) && 0,
    seconds
  );
}
