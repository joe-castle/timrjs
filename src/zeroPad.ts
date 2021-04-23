/**
 * Pads the beginning of a number that is greater than or equal 0 and less than 10 with a 0.
 *
 * @param {number} num the number to check
 *
 * @return {string|number} The padded number or the original argument.
 */
function zeroPad (num: number): string | number {
  return (num >= 0 && num < 10) ? `0${num}` : num
}

export default zeroPad
