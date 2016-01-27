'use strict';

const errors = require('./lib/errors');

class Timr {
  constructor(options) {
    this.options = options;
    this.currentTime = options.startTime;
    this.timer = null;
    this.ticker = options.ticker;
  }
  start() {
    this.timer = setInterval(() => {
      this.ticker(this.currentTime)
      this.currentTime += 1;
    }, 1000);
    return this;
  }
  pause() {
    this.clear();
    return this;
  }
  stop() {
    this.clear();
    this.currentTime = this.options.startTime;
    return this;
  }
  clear() {
    clearInterval(this.timer);
    return this;
  }
}

const checkOption = (option, value) => {
  switch(option) {
    case 'startTime':
      if(typeof value !== 'number' || value < 0) {
        throw errors.startTime;
      }
  }
}

const defaultOptions = {
  startTime: 0
}

const buildOptions = (options) => {
  for (let option in options) {
    checkOption(option, options[option]);
  }
  return Object.assign({}, defaultOptions, options);
}

const timer = (options) => {
  if (!options) {
    throw errors.noTickerMethod;
  }
  if (typeof options !== 'object') {
    throw errors.wrongOptionsType;
  }
  if (!options.hasOwnProperty('ticker')) {
    throw errors.noTickerMethod;
  }
  if (typeof options.ticker !== 'function') {
    throw errors.wrongTickerType;
  }
  return new Timr(buildOptions(options));
}

const bob = timer({
  ticker(currentTime) {
    console.log(currentTime);
  }
});

bob.start();
setTimeout(bob.pause.bind(bob), 2000);
setTimeout(bob.start.bind(bob), 4000);
setTimeout(bob.stop.bind(bob), 6000);
setTimeout(bob.start.bind(bob), 8000);
