'use strict';

/*
 * CURRENTLY NOT USED
 */

const errors = require('./lib/errors');

const checkOption = (option, value) => {
  switch(option) {
    case 'startTime':
      if(typeof value !== 'number' || value < 0) {
        throw errors.startTime;
      }
  }
};

module.exports = (options) => {
  const defaultOptions = {
    startTime: 0
  };
  for (let option in options) {
    checkOption(option, options[option]);
  }
  return Object.assign({}, defaultOptions, options);
};
