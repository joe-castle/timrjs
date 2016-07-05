(function () {
  /**
   * @description Object.assign polyfill
   *
   * @param {Object} target - The object to copy properties to
   *
   * @return {Object} The modified target object.
   */
  Object.assign = Object.assign || function assign(target, ...args) {
    const output = Object(target);

    for (let index = 1; index < args.length; index++) {
      const source = args[index];
      if (source !== undefined && source !== null) {
        for (const nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  };
}());
