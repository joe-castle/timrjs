'use strict';

const EventEmitter = require('events');
const errors = require('./lib/errors');

class Timr extends EventEmitter {
  constructor(options) {
    super();
    this.timer = null;
    this.running = false;
    this.options = options;
    this.currentTime = options.startTime;
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.timer = this.options.startTime > 0 ?
        setInterval(this.countdown.bind(this), 1000)
        :
        setInterval(this.stopwatch.bind(this), 1000);
    } else {
      console.warn('Timer already running');
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
  ticker(fn) {
    this.on('ticker', fn);
    return this;
  }
  finish(fn) {
    this.on('finish', fn);
    return this;
  }
  stopwatch() {
    this.emit('ticker', this.currentTime);
    this.currentTime += 1;
    return this;
  }
  countdown() {
    this.emit('ticker', this.currentTime);
    this.currentTime -= 1;
    if (this.currentTime < 0) {
      this.emit('finish');
      this.stop();
    }
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
  return new Timr(buildOptions(options));
};

const bob = timr({startTime: '10:00'});

bob.ticker((time) => console.log(time));
bob.finish(() => console.log('Timer finished'));

bob.start();
setTimeout(bob.pause.bind(bob), 2000);
setTimeout(bob.start.bind(bob), 4000);
setTimeout(bob.stop.bind(bob), 6000);
setTimeout(bob.start.bind(bob), 8000);
