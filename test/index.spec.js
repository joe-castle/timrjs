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

  it('Exposes the top level api', () => {
    expect(init).to.be.a('function');
    expect(init.validateStartTime).to.exist();
    expect(init.formatTime).to.exist();
    expect(init.timeToSeconds).to.exist();
    expect(init.correctFormat).to.exist();
    expect(init.createStore).to.exist();
  });
});
