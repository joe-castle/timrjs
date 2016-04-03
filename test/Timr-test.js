'use strict'

const expect = require('chai').expect;

const Timr = require('../lib/Timr');

describe('Timr Class', () => {
  describe('Timr instantiation', () => {
    it('Creates a new Timr object', () => {
      expect(new Timr(600).startTime).to.equal(600);
      expect(new Timr(600).currentTime).to.equal(600);
    });
    it('Throws an error if startTime is not a string or number', () => {
      expect(() => new Timr).to.throw(TypeError);
      expect(() => new Timr).to.throw('Expected time to be a string or number, instead got: undefined');
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
  describe('percentDone Method', () => {
    it('Returns the time elapsed in percent', () => {
      const timer = new Timr(600);
      expect(timer.percentDone()).to.equal(0);
      timer.currentTime = 400;
      expect(timer.percentDone()).to.equal(33);
    });
  });
  describe('getCurrentTime method', () => {
    it('Returns the currentTime in seconds', () => {
      expect(new Timr(600).getCurrentTime()).to.equal(600);
    });
  });
  describe('isRunning method', () => {
    it('Returns false when the timer isnt running', () => {
      expect(new Timr(600).isRunning()).to.equal(false);
    });
    it('Returns true when the timer is running', () => {
      const timer = new Timr(600).start();
      expect(timer.isRunning()).to.equal(true);
      timer.stop();
    });
  });
  describe('start method', () => {
    it('Starts the timer', (done) => {
      const timer = new Timr(600).start()
        .ticker(formattedTime => {
          expect(formattedTime).to.equal('09:59')
          timer.stop();
          done();
        });
    });
  });
  describe('pause method', () => {
    it('Pauses the timer', (done) => {
      const timer = new Timr(600).start()
        .ticker(() => {
          expect(timer.isRunning()).to.equal(true);
          timer.pause();
          expect(timer.isRunning()).to.equal(false);
          done();
        })
    });
  });
  describe('stop method', () => {
    it('Stops the timer', (done) => {
      const timer = new Timr(600).start();
      timer.ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59')
        timer.stop();
        expect(timer.getCurrentTime()).to.equal(600);
        done();
      });
    });
  });
  describe('finish method', () => {
    it('Fires the finish function when a timer finishes', (done) => {
      const timer = new Timr(1, {}).start();
      timer.finish(() => done());
    });
    it(`Throws an error if the finish method is called with no
      function provided as the first argument`, () => {
      expect(new Timr(600).finish.bind(Timr.prototype.finish)).to.throw(
        TypeError
      );
      expect(new Timr(600).finish.bind(Timr.prototype.finish)).to.throw(
        'Expected finish to be a function, instead got: undefined'
      );
    });
  });
  describe('ticker method', () => {
    it(`Fires the ticker function every second the timer runs, and
      returns the formattedTime, time and startTime in seconds`, (done) => {
      const timer = new Timr(600, {separator: ':'}).start()
        .ticker((formattedTime, percentDone, currentTime, startTime, timr) => {
          expect(formattedTime).to.equal('09:59');
          expect(percentDone).to.equal(0);
          expect(currentTime).to.equal(599);
          expect(startTime).to.equal(600);
          expect(timr).to.equal(timer);
          timer.stop();
          done();
        })
    });
    it(`Throws an error if the ticker method is called with no
      function provided as the first argument`, () => {
      expect(new Timr(600).ticker.bind()).to.throw(
        TypeError
      );
      expect(new Timr(600).ticker.bind()).to.throw(
        'Expected ticker to be a function, instead got: undefined'
      );
    });
  });
});
