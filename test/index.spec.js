import { expect } from 'chai';

import {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad,
} from '../src/index';

import Timr from '../src/Timr';

const requireTimr = require('../src/index');

describe('Index function', () => {
  it('Returns a new timr object.', () => {
    expect(create('10:00')).to.be.an.instanceof(Timr);
    expect(create('10m')).to.be.an.instanceof(Timr);
    expect(create('10h')).to.be.an.instanceof(Timr);
    expect(create(600)).to.be.an.instanceof(Timr);
    expect(create(0)).to.be.an.instanceof(Timr);
  });

  it('Exposes the top level api', () => {
    expect(zeroPad(1)).to.equal('01');
    expect(formatTime(600).formattedTime).to.equal('10:00');
    expect(timeToSeconds('10:00')).to.equal(600);
    expect(createStore(new Timr(5)).getAll()).to.be.an('array');

    const year = new Date().getFullYear();
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000);
    expect(dateToSeconds(`${year}-12-25`)).to.equal(time);
  });

  it('Works with require statements', () => {
    expect(requireTimr.create(600)).to.an.instanceOf(Timr);

    expect(requireTimr.zeroPad(1)).to.equal('01');
    expect(requireTimr.formatTime(600).formattedTime).to.equal('10:00');
    expect(requireTimr.timeToSeconds('10:00')).to.equal(600);
    expect(requireTimr.createStore(new Timr(5)).getAll()).to.be.an('array');

    const year = new Date().getFullYear();
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000);
    expect(requireTimr.dateToSeconds(`${year}-12-25`)).to.equal(time);
  });
});
