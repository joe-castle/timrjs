'use strict';

const zeroPad = require('./zeroPad');

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {String} separator - The character used to separate the time units.
 * @param {String} output - The format in which to output the time.
 *
 * @return {String} The formatted time.
 */
module.exports = function(seconds, separator, output) {
  output = output || 'MM:SS';
  separator = separator || ':';

  let minutes = seconds / 60;

  if (minutes >= 1) {
    let hours = minutes / 60;
    minutes = Math.floor(minutes);

    if (hours >= 1) {
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
      (/^HH:MM:SS$/i.test(output) ? `0${separator}` : '') +
      minutes +
      separator +
      (seconds - minutes * 60)
    );
  }

  return zeroPad(
    (/^HH:MM:SS$/i.test(output) ? `0${separator}0${separator}` :
    /^MM:SS$/i.test(output) ? `0${separator}` : '') +
    seconds
  );
};
