'use strict';

const EventEmitter = require('events');
const errors = require('./lib/errors');

// inherit from event emitter?

const countdown = () => {
  if (this.currentTime >= 0) {
    this.ticker(this.currentTime);
    this.currentTime -= 1;
  } else {

  }
};

const stopwatch = () => {
  this.ticker(this.currentTime);
  this.currentTime += 1;
};

class Timr extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.timer = null;
    this.running = false;
    this.ticker = options.ticker;
    this.currentTime = options.startTime;
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.timer = setInterval(() => {
        this.ticker(this.currentTime)
        this.options.startTime > 0 ?
          this.currentTime -= 1
          :
          this.currentTime += 1
      }, 1000);
    } else {
      // timer already running
    }
    return this;
  }
  pause() {
    this.clear();
    this.running = false;
    return this;
  }
  stop() {
    this.clear();
    this.running = false;
    this.currentTime = this.options.startTime;
    return this;
  }
  clear() {
    clearInterval(this.timer);
    return this;
  }
  getCurrentTime() {
    return this.currentTime;
  }
};

const checkOption = (option, value) => {
  switch(option) {
    case 'startTime':
      if(typeof value !== 'number' || value < 0) {
        throw errors.startTime;
      }
  }
};

const buildOptions = (options) => {
  const defaultOptions = {
    startTime: 0
  };
  for (let option in options) {
    checkOption(option, options[option]);
  }
  return Object.assign({}, defaultOptions, options);
};

const timr = (options) => {
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
};

const bob = timr({
  startTime: 10,
  ticker(currentTime) {
    console.log(currentTime);
  }
});

bob.start();
setTimeout(bob.pause.bind(bob), 2000);
setTimeout(bob.start.bind(bob), 4000);
setTimeout(bob.stop.bind(bob), 6000);
setTimeout(bob.start.bind(bob), 8000);
