'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const incorrectFormat = require('./incorrectFormat');
const errors = require('./errors');

module.exports = (startTime) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    if (incorrectFormat(startTime)) { throw errors.incorrectFormat; }
    return new Timr(timeToSeconds(startTime));
  }
  if (typeof startTime !== 'number') { throw errors.startTime; }
  return new Timr(startTime);
};
