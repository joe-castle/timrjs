'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const errors = require('./errors');

module.exports = (startTime) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    return new Timr(timeToSeconds(startTime));
  }
  if (typeof startTime !== 'number') {
    throw errors.startTime;
  }
  return new Timr(startTime);
};
