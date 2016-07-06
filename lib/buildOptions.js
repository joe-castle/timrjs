'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = buildOptions;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @description Builds an options object from default and custom options.
 *
 * @param {Object} options - Custom options.
 * @param {Object} timr - The Timr object.
 *
 * @throws If any option is invalid.
 *
 * @return {Object} Compiled options from default and custom.
 */
function buildOptions(options, timr) {
  if (options) {
    var separator = options.separator;
    var outputFormat = options.outputFormat;
    var formatType = options.formatType;

    // Error checking for separator.

    if (separator) {
      if (typeof separator !== 'string') {
        throw new Error('Expected separator to be a string, instead got: ' + (typeof separator === 'undefined' ? 'undefined' : _typeof(separator)));
      }
    }

    // Error checking for outputFormat.
    if (outputFormat) {
      if (!/^(hh:)?(mm:)?ss$/i.test(outputFormat)) {
        throw new Error('Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; instead got: ' + outputFormat);
      }
    }

    // Error checking for formatType.
    if (formatType) {
      if (!/^[hms]$/i.test(formatType)) {
        throw new Error('Expected formatType to be: h, m or s; instead got: ' + formatType);
      }
    }
  }

  return (0, _objectAssign2.default)(timr.options || { formatType: 'h', outputFormat: 'mm:ss', separator: ':' }, options);
}