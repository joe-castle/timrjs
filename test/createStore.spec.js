import { expect } from 'chai';

import createStore from '../src/createStore';
import Timr from '../src/Timr';

describe('Create Store Function', () => {
  it('Creates a new empty store.', () => {
    const store = createStore();

    expect(store.getAll()).to.have.lengthOf(0);
  });

  it('Creates a new store with the provided arguments', () => {
    const timer = new Timr(0);
    const store1 = createStore(new Timr(0), timer);

    expect(store1.getAll()).to.have.lengthOf(2);

    store1.getAll().forEach((item) => {
      expect(item).to.be.instanceof(Timr);
    });
  });

  it('Creates new store and provides timr objects with a removeFromStore function', () => {
    const store = createStore(new Timr(0), new Timr(0), new Timr(0));

    store.getAll().forEach((timr) => {
      expect(typeof timr.removeFromStore === 'function');
    });
  });

  it('Adds the timr to the store and returns the timr', () => {
    const store = createStore();
    const timer = new Timr(600);

    expect(store.add(timer)).to.equal(timer);
    expect(store.getAll()[0]).to.equal(timer);
  });

  it('Throws an error if the timr is already in a store', () => {
    const store1 = createStore();
    const store2 = createStore();
    const timer = new Timr(600);

    store1.add(timer);

    expect(() => store1.add(timer)).to.throw(
      'Unable to add to store; provided argument is either already in a store or not a timr object.',
    );

    expect(() => store2.add(timer)).to.throw(
      'Unable to add to store; provided argument is either already in a store or not a timr object.',
    );
  });

  it('Throws an error if the provided argument is not a timr object', () => {
    const store = createStore();

    expect(() => store.add('not a timr object')).to.throw(
      'Unable to add to store; provided argument is either already in a store or not a timr object.',
    );
    expect(store.add).to.throw(
      'Unable to add to store; provided argument is either already in a store or not a timr object.',
    );
  });

  it('Throws an error if the provided argument is either in a store or not a Timr object when the store is created', () => {
    expect(() => createStore('not a timer', 1, new Timr(50))).to.throw(
      'Unable to add to store; provided argument is either already in a store ' +
      'or not a timr object.',
    );
  });

  it('Starts all the timers.', (done) => {
    const timer = new Timr(600)
      .ticker(({ formattedTime }) => {
        expect(formattedTime).to.equal('09:59');
        timer.stop();
        done();
      });

    const store = createStore(timer);
    store.startAll();
  });

  it('Pauses all the timers.', (done) => {
    const store = createStore();
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

  it('Stops all the timers.', (done) => {
    const store = createStore();
    const timer = new Timr(600)
      .ticker(({ formattedTime }) => {
        expect(formattedTime).to.equal('09:59');
        store.stopAll();
        expect(timer.getCurrentTime()).to.equal(600);
        done();
      });

    store.add(timer);
    store.startAll();
  });

  it('Returns an array of all the timrs that are running.', () => {
    const timer = new Timr(600);
    const store = createStore(timer);

    expect(store.isRunning()).to.have.lengthOf(0);
    store.startAll();
    expect(store.isRunning()).to.have.lengthOf(1);
    store.stopAll();
  });

  it('Removes provided Timr from the store.', () => {
    const timer = new Timr(600);
    const store = createStore(timer);

    expect(store.getAll()).to.have.lengthOf(1);

    store.removeFromStore(timer);

    expect(store.getAll()).to.have.lengthOf(0);
    expect(timer.removeFromStore).to.equal(null);
  });

  it('Destroys all timers.', () => {
    const timer1 = new Timr(600);
    const timer2 = new Timr(600);
    const store = createStore(timer1, timer2);

    expect(store.getAll()).to.have.lengthOf(2);

    store.destroyAll();

    expect(store.getAll()).to.have.lengthOf(0);

    expect(timer1.removeFromStore).to.equal(null);
    expect(timer2.removeFromStore).to.equal(null);
  });
});
