import buildOptions from './buildOptions';

/**
 * @description Converts seconds to time format.
 *
 * @param {Number} seconds - The seconds to convert.
 * @param {Object} [options] - The options to build the string.
 *
 * @return {Object} An object that that contains the formattedTime and the
 * raw values used to calculate the time.
 */
export default function formatTime(seconds, options) {
  const { formatOutput, formatValues } = buildOptions(options);

  const raw = {};
  raw.SS = seconds;
  raw.MM = Math.floor(raw.SS / 60);
  raw.HH = raw.MM && Math.floor(raw.MM / 60); // If total minutes exceeds 60, work out hours.
  raw.DD = raw.HH && Math.floor(raw.HH / 24); // If total hours exceeds 24, work out days.
  raw.ss = raw.MM ? raw.SS - (raw.MM * 60) : raw.SS;
  raw.mm = raw.HH ? raw.MM - (raw.HH * 60) : raw.MM;
  raw.hh = raw.DD ? raw.HH - (raw.DD * 24) : raw.HH;
  raw.dd = raw.DD;

  let stringToFormat = formatOutput;

  const leftBracketPosition = stringToFormat.lastIndexOf('{') + 1;
  const rightBracketPosition = stringToFormat.indexOf('}');

  /**
   * Get values sitting inbetween { } (protectedValues)
   * Match returns empty strings for groups it can't find so filter them out.
   */
  const protectedValues = stringToFormat
    .slice(leftBracketPosition, rightBracketPosition)
    .match(/(DD)?(HH)?(MM)?(SS)?/gi)
    .filter(match => !!match);

  // If protectedValues exist, apply logic to removing them
  // otherwise, format string exactly as it appears
  if (protectedValues.length > 0) {
    let lastValueAboveZero;
    if (raw.DD > 0) lastValueAboveZero = 'DD';
    else if (raw.HH > 0) lastValueAboveZero = 'HH';
    else if (raw.MM > 0) lastValueAboveZero = 'MM';
    else if (raw.SS >= 0) lastValueAboveZero = 'SS';

    /**
     * If the lastValueAboveZero is inbetween the protectedValues than don't remove them.
     * E.G. starting string: HH:{mm:ss} and lastValueAboveZero is 'ss' than begin slice
     * at leftBracketPosition rather than beginning at ss.
     */
    const tempSlice = stringToFormat.search(new RegExp(lastValueAboveZero, 'ig'));
    const beginSlice = tempSlice >= leftBracketPosition ? leftBracketPosition : tempSlice;

    stringToFormat = stringToFormat.slice(beginSlice >= 0 ? beginSlice : 0);
  }

  // Replaces all values in string with their respective number values
  const formattedTime = stringToFormat
    // Remove any remaining curly braces before formatting.
    .replace(/\{?\}?/g, '')
    .replace(/(DD)?(HH)?(MM)?(SS)?/gi, (match) => {
      // removes whitespace caught in regex match
      if (!match) return '';

      // Apply specific function form formatValues to value.
      return formatValues[match](raw[match]);
    });

  return { formattedTime, raw };
}
