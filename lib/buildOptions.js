'use strict';

const errors = require('./errors');

const checkOption = (option, value) => {
  switch(option) {
    case 'outputFormat':
      if (
        value !== 'HH:MM:SS' &&
        value !== 'MM:SS' &&
        value !== 'SS'
      ) { throw errors.outputFormat }
  }
};

module.exports = (options) => {
  const defaultOptions = {
    outputFormat: 'MM:SS'
  };
  for (let option in options) {
    checkOption(option, options[option]);
  }
  return Object.assign({}, defaultOptions, options);
};
