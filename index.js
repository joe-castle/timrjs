'use strict';

const EventEmitter = require('events');
const errors = require('./lib/errors');

const zeroPad = (num) => (
  num < 10 ? `0${num}` : num
)

class Timr extends EventEmitter {
  constructor(startTime) {
    super();
    this.timer = null;
    this.running = false;
    this.startTime = startTime;
    this.currentTime = startTime;
  }
  start() {
    if (!this.running) {
      this.running = true;
      this.timer = this.startTime > 0 ?
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
    this.currentTime = this.startTime;
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
    this.emit('ticker', this.formatTime());
    this.currentTime += 1;
    return this;
  }
  countdown() {
    this.emit('ticker', this.formatTime());
    this.currentTime -= 1;
    if (this.currentTime < 0) {
      this.emit('finish');
      this.stop();
    }
    return this;
  }
  formatTime() {
    let seconds = this.currentTime
      , minutes = seconds / 60;
    if (minutes >= 1) {
      let hours = minutes / 60;
      minutes = Math.floor(minutes);
      if (hours >= 1) {
        hours = Math.floor(hours);
        return `${zeroPad(hours)}:${zeroPad(minutes - hours * 60)}:${zeroPad(seconds - minutes * 60)}`
      }
      return `${zeroPad(minutes)}:${zeroPad(seconds - minutes * 60)}`
    } else {
      return `${zeroPad(seconds)}`
    }
  }
  getCurrentTime() {
    return seconds;
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

const timeToSeconds = (time) => (
  time.split(':')
    .map((item, index, arr) => {
      if (arr.length === 1) { return +item; }
      if (arr.length === 2) {
        if (index === 0) { return +item * 60; }
        return +item;
      }
      if (arr.length === 3) {
        if (index === 0) { return +item * 60 * 60; }
        if (index === 1) { return +item * 60; }
        return +item
      }
    })
    .reduce((a, b) => a+b, 0)
)

const timr = (startTime) => {
  if (startTime) {
    return new Timr(timeToSeconds(startTime));
  }
  return new Timr(0);
};

const bob = timr('1:00:00');

bob.ticker((time) => console.log(time));
bob.finish(() => console.log('Timer finished'));

bob.start();
// setTimeout(bob.pause.bind(bob), 2000);
// setTimeout(bob.start.bind(bob), 4000);
// setTimeout(bob.stop.bind(bob), 6000);
// setTimeout(bob.start.bind(bob), 8000);
