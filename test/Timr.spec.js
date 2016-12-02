import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';

import Timr from '../src/Timr';
import createStore from '../src/createStore';

// Turns methods like to.be.true into to.be.true() to stop eslint failing
chai.use(dirtyChai);

const { expect } = chai;

describe('Timr Class', () => {
  describe('Timr instantiation', () => {
    it('Creates a new Timr object', () => {
      expect(new Timr(600).startTime).to.equal(600);
      expect(new Timr(600).currentTime).to.equal(600);
      expect(new Timr(0).currentTime).to.equal(0);
    });

    it('Throws an error if startTime is not a string or a number', () => {
      expect(() => new Timr({})).to.throw(
        'Expected time to be a string or number, instead got: object'
      );
    });
  });

  describe('start method', () => {
    it('Starts the timer', done => {
      const timer = new Timr(600).start()
        .ticker(formattedTime => {
          expect(formattedTime).to.equal('09:59');
          timer.stop();
          done();
        });
    });

    it('Starts the timer after a delay', done => {
      const startTime = Date.now();
      const timer = new Timr(600).start(1000)
        .ticker(() => {
          expect(Date.now() - startTime >= 2000);
          timer.stop();
          done();
        });
    });

    /* eslint-disable no-console */
    after(() => {
      console.warn.restore();
    });

    it('If a timer is running and the user tries to start it again, ' +
      'a warning in the console is logged', () => {
      sinon.stub(console, 'warn');

      new Timr(600)
        .start()
        .start()
        .destroy();

      expect(console.warn.calledWith('Timer already running')).to.be.true();
    });
    /* eslint-disable no-console */

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).start();
      expect(timer).equal(timer);
      timer.destroy();
    });
  });

  describe('pause method', () => {
    it('Pauses the timer', done => {
      const timer = new Timr(600).start()
        .ticker(() => {
          expect(timer.isRunning()).to.equal(true);
          timer.pause();
          expect(timer.isRunning()).to.equal(false);
          done();
        });
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).pause();
      expect(timer).equal(timer);
    });
  });

  describe('stop method', () => {
    it('Stops the timer', done => {
      const timer = new Timr(600).start();
      timer.ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59');
        timer.stop();
        expect(timer.getCurrentTime()).to.equal(600);
        done();
      });
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).stop();
      expect(timer).equal(timer);
    });
  });

  describe('destroy method', () => {
    it('Clears the timer and removes all event listeners', () => {
      const timer = new Timr(600);
      timer.ticker(() => {});
      timer.ticker(() => {});
      timer.finish(() => {});

      expect(timer.events.ticker.length).to.equal(2);
      expect(timer.events.finish.length).to.equal(1);

      timer.destroy();

      expect(timer.events).to.be.empty();
    });

    it('Removes the timer from the store', () => {
      const timer = new Timr(600);
      const store = createStore(timer);

      expect(store.getAll().indexOf(timer)).to.equal(0);

      timer.destroy();

      expect(store.getAll().indexOf(timer)).to.equal(-1);
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).destroy();
      expect(timer).equal(timer);
    });
  });

  describe('ticker method', () => {
    it('Fires the ticker function every second the timer runs, ' +
      'returning the formattedTime, precentDone, currentTime, ' +
      'startTime and the original Timr object.', done => {
      const timer = new Timr(600).start()
        .ticker((formattedTime, percentDone, currentTime, startTime, self) => {
          expect(formattedTime).to.equal('09:59');
          expect(percentDone).to.equal(0);
          expect(currentTime).to.equal(599);
          expect(startTime).to.equal(600);
          expect(self).to.equal(timer);
          timer.stop();
          done();
        });
    });

    it('As a stopwatch, fires the ticker function every second the timer runs, ' +
      'returning the formattedTime, currentTime and original Timr object.', done => {
      const timer = new Timr().start().ticker(
        (formattedTime, currentTime, self) => {
          expect(formattedTime).to.equal('00:01');
          expect(currentTime).to.equal(1);
          expect(self).to.equal(timer);
          timer.stop();
          done();
        }
      );
    });

    it('The stopwatch is able to be started at any given time; previously in ' +
     'pre v1.0.0 a stopwatch could only be started at 0.', done => {
      const timer = new Timr(600, { countdown: false }).start().ticker(
        (formattedTime, currentTime, self) => {
          expect(formattedTime).to.equal('10:01');
          expect(currentTime).to.equal(601);
          expect(self).to.equal(timer);
          timer.stop();
          done();
        }
      );
    });

    it('Throws an error if the ticker method is called with no ' +
      'function provided as the first argument', () => {
      expect(new Timr(600).ticker.bind()).to.throw(
        'Expected ticker to be a function, instead got: undefined'
      );
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).ticker(() => {});
      expect(timer).equal(timer);
    });
  });

  describe('finish method', () => {
    it('Fires the finish function when the timer finishes ' +
      'and provides the original Timr object.', done => {
      const timer = new Timr(1).start();
      timer.finish(self => {
        expect(self).to.equal(timer);
        done();
      });
    });

    it('As a stopwatch, fires the finish function when the ' +
      'timer reaches the maximum supported time, 999:59:59', done => {
      const timer = new Timr(3599999, { countdown: false })
        .finish(self => {
          expect(self).to.equal(timer);
          done();
        })
        .start();
    });

    it('Throws an error if the finish method is called with no ' +
      'function provided as the first argument', () => {
      expect(new Timr(600).finish.bind(Timr.prototype.finish)).to.throw(
        'Expected finish to be a function, instead got: undefined'
      );
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).finish(() => {});
      expect(timer).equal(timer);
    });
  });

  describe('formatTime method', () => {
    it('Returns the currentTime formatted into a time string', () => {
      expect(new Timr(50).formatTime()).to.equal('00:50');
      expect(new Timr(600).formatTime()).to.equal('10:00');
      expect(new Timr(9600).formatTime()).to.equal('02:40:00');
    });

    it('Returns the currentTime formatted into a time string ' +
      'with a modified outputFormat', () => {
      expect(new Timr(600, { outputFormat: 'HH:MM:SS' }).formatTime()).to.equal('00:10:00');
      expect(new Timr(50, { outputFormat: 'SS' }).formatTime()).to.equal('50');
    });

    it('Returns the currentTime formatted into a time string ' +
      'with a modifided separator', () => {
      expect(new Timr(600, { separator: '-' }).formatTime()).to.equal('10-00');
      expect(new Timr(600, { separator: 'boop' }).formatTime())
        .to.equal('10boop00');
    });

    it('Returns the startTime formatted into a time string', () => {
      expect(new Timr(50).formatTime('startTime')).to.equal('00:50');
      expect(new Timr(600).formatTime('startTime')).to.equal('10:00');
      expect(new Timr(9600).formatTime('startTime')).to.equal('02:40:00');
    });

    it('Returns the startTime formatted into a time stringwith a modified outputFormat', () => {
      expect(new Timr(600, { outputFormat: 'HH:MM:SS' }).formatTime('startTime'))
        .to.equal('00:10:00');
      expect(new Timr(50, { outputFormat: 'SS' }).formatTime('startTime')).to.equal('50');
    });

    it('Returns the startTime formatted into a time stringwith a modifided separator', () => {
      expect(new Timr(600, { separator: '-' }).formatTime('startTime')).to.equal('10-00');
      expect(new Timr(600, { separator: 'boop' }).formatTime('startTime')).to.equal('10boop00');
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

  describe('changeOptions methods', () => {
    it('Changes the timrs options after creation.', () => {
      const timer = new Timr(600);
      expect(timer.formatTime()).to.equal('10:00');
      timer.changeOptions({ separator: '-', outputFormat: 'hh:mm:ss' });
      expect(timer.formatTime()).to.equal('00-10-00');
    });

    it('Changes the timrs options after creation and merges with existing ones.', () => {
      const timer = new Timr(600, { separator: '-' });
      expect(timer.formatTime()).to.equal('10-00');
      timer.changeOptions({ separator: '-', outputFormat: 'hh:mm:ss' });
      expect(timer.formatTime()).to.equal('00-10-00');
    });

    it('Ignores { countdown: true } when the startTime has been set to 0', done => {
      const timer = new Timr()
        .changeOptions({ countdown: true })
        .ticker(ft => {
          expect(ft).to.equal('00:01')
          timer.destroy();
          done();
        })
        .start();
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).changeOptions();
      expect(timer).equal(timer);
      timer.destroy();
    });
  });

  describe('setStartTime method', () => {
    it('Changes the startTime after Timr created', () => {
      const timer = new Timr(600);
      expect(timer.startTime).to.equal(600);
      timer.setStartTime(800);
      expect(timer.startTime).to.equal(800);
      timer.setStartTime('10m');
      expect(timer.startTime).to.equal(600);
    });

    it('Clears the existing timer and sets the ' +
      'currentTime and startTime to the new starTime', done => {
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

      expect(timer.setStartTime.bind(timer, '12-12')).to.throw(Error);
      expect(timer.setStartTime.bind(timer, 8737475638)).to.throw(Error);
    });

    it('Setsup a stopwatch if the newStartTime is falsy or 0', done => {
      const timer = new Timr(600);

      timer.setStartTime(0);

      timer.ticker((ft, ct) => {
        expect(ft).to.equal('00:01')
        expect(ct).to.equal(1)
        timer.destroy();
        done();
      })
      .start();
    });

    it('Returns a reference to the Timr', () => {
      const timer = new Timr(600).setStartTime();
      expect(timer).equal(timer);
      timer.destroy();
    });
  });

  describe('getStartTime method', () => {
    it('Returns the currentTime in seconds', () => {
      expect(new Timr(600).getStartTime()).to.equal(600);
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
