'use strict';

const incorrectFormat = require('./incorrectFormat');

module.exports = (time) => {
  if (typeof time === 'string') {
    if (incorrectFormat(time)) {
      throw new Error(
        `Expected time format (HH:MM:SS, MM:SS or SS), instead got: ${time}`
      );
    }
  }

  else if (typeof time !== 'number') {
    throw new TypeError(
      `Expected time to be of type string or number, instead got: ${typeof time}`
    );
  }
}
