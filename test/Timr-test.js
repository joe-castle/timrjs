'use strict'

const expect = require('chai').expect;

const Timr = require('../lib/Timr');
const store = require('../lib/store');

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
  describe('destroy method', () => {
    it('Clears the timer and removes all event listeners', () => {
      const timer  = new Timr(600);
      timer.ticker(() => {});
      timer.ticker(() => {});
      timer.finish(() => {});

      expect(timer.listenerCount('ticker')).to.equal(2);
      expect(timer.listenerCount('finish')).to.equal(1);

      timer.destroy();

      expect(timer.listenerCount('ticker')).to.equal(0);
      expect(timer.listenerCount('finish')).to.equal(0);
    });
    it('Removes the timer from the store', () => {
      const timer = store(new Timr(600));

      expect(store.getAll().indexOf(timer)).to.equal(0);

      timer.destroy();

      expect(store.getAll().indexOf(timer)).to.equal(-1);
    });
  });
  describe('ticker method', () => {
    it(`Fires the ticker function every second the timer runs, and
      returns the formattedTime, precentDone, currentTime, startTime and the original Timr object.`, (done) => {
      const timer = new Timr(600, {separator: ':'}).start()
        .ticker((formattedTime, percentDone, currentTime, startTime, self) => {
          expect(formattedTime).to.equal('09:59');
          expect(percentDone).to.equal(0);
          expect(currentTime).to.equal(599);
          expect(startTime).to.equal(600);
          expect(self).to.equal(timer);
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
  describe('finish method', () => {
    it('Fires the finish function when the timer finishes and provides the original Timr object.', (done) => {
      const timer = new Timr(1, {}).start();
      timer.finish(self => {
        expect(self).to.equal(timer);
        done()
      });
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
  describe('percentDone method', () => {
    it('Returns the time elapsed in percent', () => {
      const timer = new Timr(600);
      expect(timer.percentDone()).to.equal(0);
      timer.currentTime = 400;
      expect(timer.percentDone()).to.equal(33);
    });
  });
  describe('setStartTime method', () => {
    it('Changes the startTime after Timr created', () => {
      const timer = new Timr(600);
      expect(timer.startTime).to.equal(600);
      timer.setStartTime(800);
      expect(timer.startTime).to.equal(800);
    });
    it('Clears the existing timer and sets the currentTime and startTime to the new starTime', (done) => {
      const timer = new Timr(600).start();
      timer.ticker((ft, pd, ct) => {
        expect(ct).to.equal(599);
        timer.setStartTime('11:00');
        expect(timer.startTime).to.equal(660);
        expect(timer.currentTime).to.equal(660);
        done();
      });
    });
    it('Throws an error if the newly provided startTime is invalid', () => {
      const timer = new Timr(600);

      expect(timer.setStartTime.bind(timer, '123:123')).to.throw(Error);
      expect(timer.setStartTime.bind(timer, 8737475638)).to.throw(Error);
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
});
