'use strict'

const expect = require('chai').expect;

const Timr = require('../lib/Timr');

describe('Timr Class', () => {
  describe('Timr instantiation', () => {
    it('Creates a new Timr object', () => {
      expect(new Timr(600).startTime).to.equal(600);
      expect(new Timr(600).currentTime).to.equal(600);
    });
  });
  describe('formatTime method', () => {
    it('Returns 24hr human readble time', () => {
      expect(new Timr(600, {separator: ':'}).formatTime()).to.equal('10:00');
      expect(new Timr(9600, {separator: ':'}).formatTime()).to.equal('02:40:00');
    });
    it('Returns 24hr human readable time with a modified outputFormat', () => {
      expect(new Timr(600, {outputFormat: 'HH:MM:SS', separator: ':'}).formatTime()).to.equal('00:10:00');
      expect(new Timr(50, {outputFormat: 'SS', separator: ':'}).formatTime()).to.equal('50');
    })
    it('Returns 24hr human readable time with a modifided separator', () => {
      expect(new Timr(600, {separator: '-'}).formatTime()).to.equal('10-00');
      expect(new Timr(600, {separator: 'boop'}).formatTime()).to.equal('10boop00');
    })
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
    })
  });
  describe('start method', () => {
    it('Starts the timer', (done) => {
      const timr = new Timr(600, {separator: ':'}).start()
        .ticker(currentTime => {
          expect(currentTime).to.equal('09:59')
          timr.stop();
          done();
        });
    });
    it('Pauses the timer', (done) => {
      const timr = new Timr(600, {separator: ':'}).start()
        .ticker(() => {
          expect(timr.isRunning()).to.equal(true);
          timr.pause();
          expect(timr.isRunning()).to.equal(false);
          done();
        })
    })
    it('Stops the timer', (done) => {
      const timr = new Timr(600, {separator: ':'}).start();
      timr.ticker(currentTime => {
        expect(currentTime).to.equal('09:59')
        timr.stop();
        expect(timr.getCurrentTime()).to.equal(600);
        done();
      });
    });
    it('Fires the finish function when a timer finishes', (done) => {
      const timr = new Timr(1, {}).start();
      timr.finish(() => done());
    })
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
    })
  });
});
