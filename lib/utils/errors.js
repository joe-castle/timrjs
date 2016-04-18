'use strict';

module.exports = (value) => (
  error => ({
    outputFormatType: new TypeError(`Expected outputFormat to be a string, instead got: ${typeof value}`),
    invalidOutputFormat: new Error(`Expected outputFormat to be: HH:MM:SS, MM:SS (default) or SS, instead got: ${value}`),
    separatorType: new TypeError(`Expected separator to be a string, instead got: ${typeof value}`),
    invalidTime: new Error(`Expected time format (HH:MM:SS, MM:SS or SS), instead got: ${value}`),
    invalidTimeType: new TypeError(`Expected time to be a string or number, instead got: ${
      typeof value === 'number' ? value : typeof value
    }`),
    timeOverADay: new Error('Sorry, we don\'t support any time over 999:59:59.'),
    ticker: new TypeError(`Expected ticker to be a function, instead got: ${typeof value}`),
    finish: new TypeError(`Expected finish to be a function, instead got: ${typeof value}`)
  }[error])
);
