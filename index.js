'use strict';

const errors = require('./lib/errors');

const defaultOptions = {
  timrType: 'timer',
  startTimer: 10
}

class Timr {
  constructor(options) {
    this.options = options || defaultOptions;
  }
  start() {
    this.timer = setInterval(() => {
      this.options.action(this.startTime)
    }, 1000);
    return this;
  }
  pause() {
    return this;
  }
  reset() {
    return this;
  }
  clear() {
    clearInterval(this.timer);
    return this;
  }
}

const buildOptions = (options) => {
  if (options.type !== undefined && typeof options.type !== 'string') {
    throw new errors.
  }
  return finalOptions;
}

const timer = (options) => {
  if (!options) {
    throw errors.noTickerMethod;
  }
  if (typeof options !== 'object') {
    throw errors.wrongOptionsType;
  }
  if (options.action === undefined) {
    throw errors.noTickerMethod;
  }
  if (typeof options.action !== 'function') {
    throw errors.wrongTickerType;
  }
  const finalOptions = buildOptions(options);
  return new Timr(finalOptions);
}

timer({});
