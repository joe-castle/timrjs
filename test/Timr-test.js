'use strict'

const expect = require('chai').expect;

const Timr = require('../lib/Timr');

describe('Timr Class', () => {
  describe('Timr instantiation', () => {
    it('Creates a new Timr object', () => {
      expect(new Timr(600).startTime).to.equal(600);
      expect(new Timr(600).currentTime).to.equal(600);
    });
    it('Throws an error if startTime is not of type string or number', () => {
      expect(() => new Timr).to.throw(TypeError);
      expect(() => new Timr).to.throw('Expected time to be of type string or number, instead got: undefined');
    });
  });
  describe('formatTime method', () => {
    it('Returns 24hr human readble time', () => {
      expect(new Timr(50).formatTime()).to.equal('00:50');
      expect(new Timr(600).formatTime()).to.equal('10:00');
      expect(new Timr(9600).formatTime()).to.equal('02:40:00');
    });
    it('Returns 24hr human readable time with a modified outputFormat', () => {
      expect(new Timr(600, {outputFormat: 'HH:MM:SS'}).formatTime()).to.equal('00:10:00');
      expect(new Timr(50, {outputFormat: 'SS'}).formatTime()).to.equal('50');
    })
    it('Returns 24hr human readable time with a modifided separator', () => {
      expect(new Timr(600, {separator: '-'}).formatTime()).to.equal('10-00');
      expect(new Timr(600, {separator: 'boop'}).formatTime()).to.equal('10boop00');
    });
  });
  describe('getCurrentTime method', () => {
    it('Returns the currentTime in seconds', () => {
      expect(new Timr(600).getCurrentTime()).to.equal(600);
    });
  });
  describe('isRunning method', () => {
    it('Returns false when the timr isnt running', () => {
      expect(new Timr(600).isRunning()).to.equal(false);
    });
    it('Returns true when the timr is running', () => {
      const timr = new Timr(600).start();
      expect(timr.isRunning()).to.equal(true);
      timr.stop();
    });
  });
  describe('start method', () => {
    it('Starts the timer', (done) => {
      const timr = new Timr(600).start()
        .ticker(currentTime => {
          expect(currentTime).to.equal('09:59')
          timr.stop();
          done();
        });
    });
  });
  describe('pause method', () => {
    it('Pauses the timer', (done) => {
      const timr = new Timr(600).start()
        .ticker(() => {
          expect(timr.isRunning()).to.equal(true);
          timr.pause();
          expect(timr.isRunning()).to.equal(false);
          done();
        })
    });
  });
  describe('stop method', () => {
    it('Stops the timer', (done) => {
      const timr = new Timr(600).start();
      timr.ticker(currentTime => {
        expect(currentTime).to.equal('09:59')
        timr.stop();
        expect(timr.getCurrentTime()).to.equal(600);
        done();
      });
    });
  });
  describe('finish method', () => {
    it('Fires the finish function when a timer finishes', (done) => {
      const timr = new Timr(1, {}).start();
      timr.finish(() => done());
    });
    it(`Throws an error if the finish method is called with no
      function provided as the first argument`, () => {
      expect(new Timr(600).finish.bind(Timr.prototype.finish)).to.throw(
        TypeError
      );
      expect(new Timr(600).finish.bind(Timr.prototype.finish)).to.throw(
        'Warning! Finish requires a function, instead got: undefined'
      );
    });
  });
  describe('ticker method', () => {
    it(`Fires the ticker function every second the timer runs, and
      returns the formattedTime, time and startTime in seconds`, (done) => {
      const timr = new Timr(600, {separator: ':'}).start()
        .ticker((currentTime, seconds, startTime) => {
          expect(currentTime).to.equal('09:59');
          expect(seconds).to.equal(599);
          expect(startTime).to.equal(600);
          timr.stop();
          done();
        })
    });
    it(`Throws an error if the ticker method is called with no
      function provided as the first argument`, () => {
      expect(new Timr(600).ticker.bind()).to.throw(
        TypeError
      );
      expect(new Timr(600).ticker.bind()).to.throw(
        'Warning! Ticker requires a function, instead got: undefined'
      );
    });
  });
});
