import { expect } from 'chai';

import store from '../src/store';
import Timr from '../src/Timr';

describe('Store', () => {
  afterEach(() => {
    store.destroyAll();
  });

  it('Adds the timr to the store and returns timr', () => {
    const timer = new Timr(600);
    expect(store.add(timer)).to.equal(timer);
    expect(store.getAll()[0]).to.equal(timer);
  });

  it('Starts all the timers.', done => {
    const timer = new Timr(600)
      .ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59');
        done();
      });

    store.add(timer);
    store.startAll();
  });

  it('Pauses all the timers.', done => {
    const timer = new Timr(600)
      .ticker(() => {
        expect(timer.isRunning()).to.equal(true);
        store.pauseAll();
        expect(timer.isRunning()).to.equal(false);
        done();
      });

    store.add(timer);
    store.startAll();
  });

  it('Stops all the timers.', done => {
    const timer = new Timr(600)
      .ticker(formattedTime => {
        expect(formattedTime).to.equal('09:59');
        store.stopAll();
        expect(timer.getCurrentTime()).to.equal(600);
        done();
      });

    store.add(timer);
    store.startAll();
  });

  it('Returns an array of all the timrs that are running', () => {
    const timer = new Timr(600);
    store.add(timer);
    expect(store.isRunning()).to.have.lengthOf(0);
    store.startAll();
    expect(store.isRunning()).to.have.lengthOf(1);
  });
});
