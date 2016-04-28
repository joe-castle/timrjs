'use strict';

const zeroPad = require('./zeroPad');

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {String} separator - The character used to separate the time units.
 * @param {String} outputFormat - The way the time is displayed.
 * @param {String} formatType - The way in which the time string is created.
 *
 * @return {String} The formatted time.
 */
module.exports = function(seconds, separator, outputFormat, formatType) {
  formatType = formatType || 'h';
  outputFormat = outputFormat || 'mm:ss';
  separator = separator || ':';

  if (formatType === 's') {
    return `${seconds}`;
  }

  let minutes = seconds / 60;

  if (minutes >= 1 && /[hm]/i.test(formatType)) {
    let hours = minutes / 60;
    minutes = Math.floor(minutes);

    if (hours >= 1 && /[h]/i.test(formatType)) {
      hours = Math.floor(hours);

      return zeroPad(
        hours +
        separator +
        (minutes - hours * 60) +
        separator +
        (seconds - minutes * 60)
      );
    }

    return zeroPad(
      (/^HH:MM:SS$/i.test(outputFormat) ? `0${separator}` : '') +
      minutes +
      separator +
      (seconds - minutes * 60)
    );
  }

  return zeroPad(
    (/^HH:MM:SS$/i.test(outputFormat) ? `0${separator}0${separator}` :
    /^MM:SS$/i.test(outputFormat) ? `0${separator}` : '') +
    seconds
  );
};
