'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function (value) {
  return function (error) {
    return {
      outputFormatType: new TypeError('Expected outputFormat to be a string, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      invalidOutputFormat: new Error('Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; ' + ('instead got: ' + value)),
      formatType: new TypeError('Expected formatType to be a string, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      invalidFormatType: new Error('Expected formatType to be: h, m or s; instead got: ' + value),
      separatorType: new TypeError('Expected separator to be a string, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      invalidTime: new Error('Expected a time string, instead got: ' + value),
      invalidTimeType: new TypeError('Expected time to be a string or number, instead got: ' + (typeof value === 'number' ? value : typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      maxTime: new Error('Sorry, we don\'t support any time over 999:59:59.'),
      ticker: new TypeError('Expected ticker to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))),
      finish: new TypeError('Expected finish to be a function, instead got: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)))
    }[error];
  };
};