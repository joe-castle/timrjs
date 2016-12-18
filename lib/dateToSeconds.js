var zeroPad = function zeroPad(number) {
  return number < 10 ? '0' + number : number;
};

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
  if (/^(\d{4}-\d{2}-\d{2})?(T\d{2}:\d{2}(:\d{2})?)?(([-+]\d{2}:\d{2})?Z?)?$/i.test(startTime) || startTime >= 63072000000) {
    var dateNow = new Date();
    var newStartTime = startTime;

    if (/^(\d{4}-\d{2}-\d{2})$/i.test(newStartTime)) {
      newStartTime = newStartTime + 'T00:00';
    }

    var parsedStartTime = new Date(newStartTime).getTime();
    var startTimeInSeconds = Math.ceil((parsedStartTime - dateNow.getTime()) / 1000);

    if (isNaN(parsedStartTime)) {
      throw new Error('The date/time you passed does not match ISO format. ' + ('You passed: "' + startTime + '".'));
    }

    if (startTimeInSeconds < 0) {
      throw new Error('When passing a date/time, it cannot be in the past. ' + ('You passed: "' + startTime + '". It\'s currently: ') + ('"' + zeroPad(dateNow.getFullYear()) + '-' + (zeroPad(dateNow.getMonth()) + 1) + '-') + (zeroPad(dateNow.getDate()) + ' ') + (zeroPad(dateNow.getHours()) + ':' + zeroPad(dateNow.getMinutes()) + ':') + (zeroPad(dateNow.getSeconds()) + '"'));
    }

    return {
      originalDate: startTime,
      parsed: startTimeInSeconds
    };
  }

  return startTime;
}