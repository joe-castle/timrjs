'use strict';

const EventEmitter = require('events');

const pad = require('./pad');

module.exports = class Timr extends EventEmitter {
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
      if (this.startTime > 0) {
        this.countdown();
        this.timer = setInterval(this.countdown.bind(this), 1000);
      } else {
        this.stopwatch();
        this.timer = setInterval(this.stopwatch.bind(this), 1000);
      }
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
        return `${pad(hours)}:${pad(minutes - hours * 60)}:${pad(seconds - minutes * 60)}`
      }
      return `${pad(minutes)}:${pad(seconds - minutes * 60)}`
    }
    return `${pad(seconds)}`
  }
  getCurrentTime() {
    return seconds;
  }
};
