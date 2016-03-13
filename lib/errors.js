module.exports = (value) => ({
  startTime: new TypeError(`The starting time needs to be a number (seconds) or a string representation of the time, e.g. 10:00. Instead got: ${value}`),
  incorrectFormat: new Error(`Provided time is not in the correct format. Expected HH:MM:SS / MM:SS / SS, got: ${value}`),
  eventFunctions: new TypeError(`Ticker/finish requires a function, instead got: ${value}`),
  outputFormat: new Error(`Incorrect outputFormat, expected a string: HH:MM:SS, MM:SS or SS. Instead got: ${value}`),
  separator: new TypeError(`Expected separator to be a string, instead got: ${value}`)
});
