import chai from 'chai';
import dirtyChai from 'dirty-chai';

import init from '../src/index';
import Timr from '../src/Timr';

// Turns methods like to.be.true into to.be.true() to stop eslint failing
chai.use(dirtyChai);

const { expect } = chai;


describe('Index function', () => {
  it('Returns a new timr object.', () => {
    expect(init('10:00')).to.be.an.instanceof(Timr);
    expect(init('10m')).to.be.an.instanceof(Timr);
    expect(init('10h')).to.be.an.instanceof(Timr);
    expect(init(600)).to.be.an.instanceof(Timr);
    expect(init(0)).to.be.an.instanceof(Timr);
  });

  // it('Adds a timer to the store with global store setting false', () => {
  //   const timer = init('10:00', { store: true });
  //
  //   expect(init.getAll()[0]).to.equal(timer);
  // });
  //
  // it('Adds timrs to the store with the global store setting true', () => {
  //   init.store = true;
  //
  //   init('10:00');
  //   init(600);
  //   init(0);
  //
  //   expect(init.getAll()).to.be.of.length(3);
  // });
  //
  // it('Does not add a timr to the store with the global store setting of true', () => {
  //   init.store = true;
  //
  //   init('10:00');
  //   init(600);
  //   init(0, { store: false });
  //
  //   expect(init.getAll()).to.be.of.length(2);
  // });

  it('Exposes the top level api', () => {
    expect(init).to.be.a('function');
    expect(init.validate).to.exist();
    expect(init.formatTime).to.exist();
    expect(init.timeToSeconds).to.exist();
    expect(init.correctFormat).to.exist();
    expect(init.createStore).to.exist();
  });
});
