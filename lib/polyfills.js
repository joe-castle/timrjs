'use strict';

(function () {
  'use strict';

  /**
   * @description Object.assign polyfill
   *
   * @param {Object} target - The object to copy properties to
   *
   * @return {Object} The modified target object.
   */

  Object.assign = Object.assign || function (target) {
    var output = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== undefined && source !== null) {
        for (var nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  };
})();