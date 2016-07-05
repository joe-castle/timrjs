/**
 * @description Pads out single digit numbers in a string
 * with a 0 at the beginning. Primarly used for time units - 00:00:00.
 *
 * @param {String} str - String to be padded.
 * @return {String} A 0 padded string or the the original string.
 */
module.exports = str => (
  str.replace(/\d+/g, match => (
    Number(match) < 10 ? `0${match}` : match
  ))
);
