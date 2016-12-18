import buildOptions from './buildOptions';

var zeroPad = function zeroPad(number) {
  return number < 10 ? '0' + number : '' + number;
};

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
  var _buildOptions = buildOptions(options);

  var formatOutput = _buildOptions.formatOutput;
  var padRaw = _buildOptions.padRaw;


  var totalSeconds = seconds;
  var totalMinutes = Math.floor(totalSeconds / 60);
  var totalHours = totalMinutes && Math.floor(totalMinutes / 60);
  var totalDays = totalHours && Math.floor(totalHours / 24);
  var currentSeconds = totalMinutes ? totalSeconds - totalMinutes * 60 : totalSeconds;
  var currentMinutes = totalHours ? totalMinutes - totalHours * 60 : totalMinutes;
  var currentHours = totalDays ? totalHours - totalDays * 24 : totalHours;
  var currentDays = totalDays;

  var stringToFormat = formatOutput;

  var leftBracketPosition = stringToFormat.lastIndexOf('{') + 1;
  var rightBracketPosition = stringToFormat.indexOf('}');

  /**
   * Get values sitting inbetween { }
   * Match returns empty strings for groups it can't find so filter them out.
   */
  var protectedValues = stringToFormat.slice(leftBracketPosition, rightBracketPosition).match(/(DD)?(HH)?(MM)?(SS)?/gi).filter(function (match) {
    return !!match;
  });

  // If no protectedValues then format string exactly as it appears
  if (protectedValues.length > 0) {
    var lastValueAboveZero = void 0;
    if (totalDays > 0) lastValueAboveZero = 'DD';else if (totalHours > 0) lastValueAboveZero = 'HH';else if (totalMinutes > 0) lastValueAboveZero = 'MM';else if (totalSeconds >= 0) lastValueAboveZero = 'SS';

    /**
     * If the lastValueAboveZero is inbetween the protectedValues than don't remove them.
     * E.G. starting string: HH:{mm:ss} and lastValueAboveZero is 'ss' than begin slice
     * at leftBracketPosition rather than beginning at ss.
     */
    var tempSlice = stringToFormat.search(new RegExp(lastValueAboveZero, 'ig'));
    var beginSlice = tempSlice >= leftBracketPosition ? leftBracketPosition : tempSlice;

    stringToFormat = stringToFormat.slice(beginSlice >= 0 ? beginSlice : 0);
  }

  // Replaces all values in string with their respective number values
  var formattedTime = stringToFormat.replace(/\{?\}?/g, '').replace(/DD/g, totalDays).replace(/HH/g, zeroPad(totalHours)).replace(/MM/g, zeroPad(totalMinutes)).replace(/SS/g, zeroPad(totalSeconds)).replace(/dd/g, currentDays).replace(/hh/g, zeroPad(currentHours)).replace(/mm/g, zeroPad(currentMinutes)).replace(/ss/g, zeroPad(currentSeconds));

  return {
    formattedTime: formattedTime,
    raw: {
      totalDays: padRaw ? zeroPad(totalDays) : totalDays,
      totalHours: padRaw ? zeroPad(totalHours) : totalHours,
      totalMinutes: padRaw ? zeroPad(totalMinutes) : totalMinutes,
      totalSeconds: padRaw ? zeroPad(totalSeconds) : totalSeconds,
      currentDays: padRaw ? zeroPad(currentDays) : currentDays,
      currentHours: padRaw ? zeroPad(currentHours) : currentHours,
      currentMinutes: padRaw ? zeroPad(currentMinutes) : currentMinutes,
      currentSeconds: padRaw ? zeroPad(currentSeconds) : currentSeconds
    }
  };
}