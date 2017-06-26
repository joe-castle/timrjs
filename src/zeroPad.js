/**
 * @description Pads beginning of number that are greater than or equal 0 and less than 10 with a 0.
 *
 * @param {Number} num - the number to check
 *
 * @returns {String|Any} The padded number or the original argument.
 */
export default function zeroPad (num) {
  return (num >= 0 && num < 10) ? `0${num}` : num
}
