import { expect } from 'chai';

import timeToSeconds from '../src/timeToSeconds';

describe('Time To Seconds function', () => {
  it('Returns the converted the provided time (string) to seconds (number)', () => {
    expect(timeToSeconds('10:00')).to.equal(600);
    expect(timeToSeconds('10:00')).to.be.a('number');

    expect(timeToSeconds('50')).to.equal(50);

    expect(timeToSeconds('02:40:00')).to.equal(9600);
  });

  it('Rounds the converted number to avoid errors with floating point values', () => {
    expect(timeToSeconds('02:40.5:00')).to.equal(9630);
    expect(timeToSeconds('05.5:00')).to.equal(330);
  });

  it('Returns the original time if that time was a number', () => {
    expect(timeToSeconds(600)).to.equal(600);
  });
});
