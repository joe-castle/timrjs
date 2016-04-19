'use strict';

const expect = require('chai').expect;

const init = require('../src/index');
const Timr = require('../src/Timr');

describe('Init function', () => {
  it('Returns a new timr object.', () => {
    expect(init('10:00')).to.be.an.instanceof(Timr);
    expect(init(600)).to.be.an.instanceof(Timr);
    expect(init(0)).to.be.an.instanceof(Timr);
  });
  it('Exposes helper methods', () => {
    expect(init.validate).to.exist;
    expect(init.formatTime).to.exist;
    expect(init.timeToSeconds).to.exist;
    expect(init.incorrectFormat).to.exist;
    expect(init.store).to.exist;
    expect(init.getAll).to.exist;
    expect(init.startAll).to.exist;
    expect(init.pauseAll).to.exist;
    expect(init.stopAll).to.exist;
    expect(init.isRunning).to.exist;
    expect(init.removeFromStore).to.exist;
    expect(init.destroyAll).to.exist;
  });
});
