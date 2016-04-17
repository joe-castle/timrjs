'use strict';

const zeroPad = require('./zeroPad');

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {String} output - The format in which to output the time.
 * @param {String} sep - The character used to separate the time units.
 *
 * @return {String} The formatted time.
 */
module.exports = function(seconds, sep, output) {
  seconds = seconds || this.currentTime;
  sep     = sep     || this.separator || ':';
  output  = output  || this.outputFormat || 'MM:SS';

  let minutes = seconds / 60;

  if (minutes >= 1) {
    let hours = minutes / 60;
    minutes = Math.floor(minutes);

    if (hours >= 1) {
      hours = Math.floor(hours);

      return zeroPad(
        `${hours}${sep}${minutes - hours * 60}${sep}${seconds - minutes * 60}`
      );
    }

    return zeroPad(
      `${output === 'HH:MM:SS' ? `0${sep}` : ''}${minutes}${sep}${seconds - minutes * 60}`
    );
  }

  return zeroPad(
    `${output === 'HH:MM:SS' ? `0${sep}0${sep}` : output === 'MM:SS' ? `0${sep}` : ''}${seconds}`
  );
}
