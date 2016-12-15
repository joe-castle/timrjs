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
  // const { outputFormat, formatType, separator } = buildOptions(options);

  // /**
  //  * @description Creates a timestring.
  //  * Created inside formatTime to have access to separator argument,
  //  *
  //  * @param {Array} [...args] - All arguments to be processed
  //  *
  //  * @return {String} The compiled time string.
  //  */
  // const createTimeString = function createTimeString(...args) {
  //   return args
  //     .filter(value => value !== false)
  //     .map(value => (value < 10 ? `0${value}` : value))
  //     .join(separator);
  // };

  // if (formatType === 's') {
  //   return `${seconds}`;
  // }

  // let minutes = seconds / 60;

  // if (minutes >= 1 && /[hm]/i.test(formatType)) {
  //   let hours = minutes / 60;
  //   minutes = Math.floor(minutes);

  //   if (hours >= 1 && /[h]/i.test(formatType)) {
  //     hours = Math.floor(hours);

  //     return createTimeString(
  //       hours,
  //       minutes - hours * 60,
  //       seconds - minutes * 60
  //     );
  //   }

  //   return createTimeString(
  //     /HH:MM:SS/i.test(outputFormat) && 0,
  //     minutes,
  //     seconds - minutes * 60
  //   );
  // }

  // return createTimeString(
  //   /HH:MM:SS/i.test(outputFormat) && 0,
  //   /MM:SS/i.test(outputFormat) && 0,
  //   seconds
  // );

  // DDdd days HHhh hours MMmm minutes SSss seconds

  const SS = seconds;
  const MM = Math.floor(SS / 60);
  const HH = MM && Math.floor(MM / 60);
  const DD = HH && Math.floor(HH / 24);
  const ss = MM ? SS - MM * 60 : SS;
  const mm = HH ? MM - HH * 60 : MM;
  const hh = DD ? HH - DD * 24 : HH;

  const string = 'DD days HH:{mm:ss}';

  const leftBracketPosition = string.lastIndexOf('{') + 1;
  const rightBracketPosition = string.indexOf('}');

  // Get values sitting inbetween { }
  const protectedValues = string
    .substring(leftBracketPosition, rightBracketPosition)
    .match(/(DD)?(HH)?(MM)?(SS)?/gi)
    .filter(match => !!match);

  let newString = string;

  // If no protectedValues then format string exactly as it appears
  if (protectedValues.length > 0) {
    let lastValueAboveZero;
    if (DD > 0) lastValueAboveZero = 'DD';
    else if (HH > 0) lastValueAboveZero = 'HH';
    else if (MM > 0) lastValueAboveZero = 'MM';
    else if (SS >= 0) lastValueAboveZero = 'SS';

    // If the lastValueAboveZero is inbetween the protectedValues than don't remove them.
    // E.G. starting string: HH:{mm:ss} and lastValueAboveZero is 'ss' than begin slice
    // at leftBracketPosition rather than beginning of ss.
    const tempSlice = string.search(new RegExp(lastValueAboveZero, 'ig'));
    const beginSlice = tempSlice >= leftBracketPosition ? leftBracketPosition : tempSlice;

    newString = newString.slice(beginSlice >= 0 ? beginSlice : 0);
  }

  // Replaces all values in string with their respective number values
  const formattedTime = newString
    .replace(/\{?\}?/g, '')
    .replace(/SS/g, SS)
    .replace(/MM/g, MM)
    .replace(/HH/g, HH)
    .replace(/DD/g, DD)
    .replace(/ss/g, ss)
    .replace(/mm/g, mm)
    .replace(/hh/g, hh);

  return {
    formattedTime,
    DD, HH, MM, SS,
    ss, mm, hh,
  };
}
