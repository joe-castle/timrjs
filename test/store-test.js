'use strict'

const expect = require('chai').expect;

const store = require('../lib/store');
const Timr = require('../lib/Timr');

describe('Store', () => {
  afterEach(() => {
    store.destroyAll();
  });

  it('Adds the timr to the store and returns timr', () => {
    const timer = new Timr(600);
    expect(store(timer)).to.equal(timer);
    expect(store.getAll()[0]).to.equal(timer);
  });
  it('Starts all the timers.', (done) => {
    const timer = new Timr(600)
      .ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59')
        done();
      });

    store(timer);
    store.startAll();
  });
  it('Pauses all the timers.', (done) => {
    const timer = new Timr(600)
      .ticker(formattedTime => {
        expect(timer.isRunning()).to.equal(true);
        store.pauseAll();
        expect(timer.isRunning()).to.equal(false);
        done();
      });

    store(timer);
    store.startAll();
  });
  it('Stops all the timers.', (done) => {
    const timer = new Timr(600)
      .ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59')
        store.stopAll();
        expect(timer.getCurrentTime()).to.equal(600);
        done();
      });

    store(timer);
    store.startAll();
  });
  it('Returns an array of all the timrs that are running', () => {
    const timer = new Timr(600);

    store(timer);

    expect(store.isRunning()).to.have.lengthOf(0);

    store.startAll();

    expect(store.isRunning()).to.have.lengthOf(1);
  })
});
