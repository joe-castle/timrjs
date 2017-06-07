import { expect } from 'chai';

import timeToSeconds from '../src/timeToSeconds';

describe('Time To Seconds function', () => {
  it('Returns the provided time (string) converted to seconds (number)', () => {
    expect(timeToSeconds('10:00')).to.equal(600);
    expect(timeToSeconds('10:00')).to.be.a('number');
    expect(timeToSeconds('50')).to.equal(50);
    expect(timeToSeconds('02:40:00')).to.equal(9600);
    expect(timeToSeconds('10m')).to.equal(600);
    expect(timeToSeconds('10h')).to.equal(36000);
  });

  it('Rounds the converted number to avoid errors with floating point values', () => {
    expect(timeToSeconds(9629.5)).to.equal(9630);
    expect(timeToSeconds(329.5)).to.equal(330);
  });

  it('Returns the original time if that time was a number', () => {
    expect(timeToSeconds(600)).to.equal(600);
  });

  it('Throws an error if provided time is not valid', () => {
    expect(() => timeToSeconds('boom')).to.throw(
      'Expected time to be in (hh:mm:ss) format, instead got: boom',
    );
    expect(() => timeToSeconds({})).to.throw(
      'Expected time to be a string or number, instead got: object',
    );
    expect(() => timeToSeconds(() => {})).to.throw(
      'Expected time to be a string or number, instead got: function',
    );
    expect(() => timeToSeconds(-1)).to.throw(
      'Time cannot be a negative number, got: -1',
    );
    expect(() => timeToSeconds('-1')).to.throw(
      'Time cannot be a negative number, got: -1',
    );
    expect(() => timeToSeconds(NaN)).to.throw(
      'Expected time to be a string or number, instead got: NaN',
    );
    expect(() => timeToSeconds(Infinity)).to.throw(
      'Expected time to be a string or number, instead got: Infinity',
    );
    expect(() => timeToSeconds(-Infinity)).to.throw(
      'Expected time to be a string or number, instead got: -Infinity',
    );
    expect(() => timeToSeconds(null)).to.throw(
      'Expected time to be a string or number, instead got: null',
    );
  });

  it('Does not throw an error when the time is valid', () => {
    expect(() => timeToSeconds(600)).to.not.throw(Error);
    expect(() => timeToSeconds('600')).to.not.throw(Error);
    expect(() => timeToSeconds('10:00')).to.not.throw(Error);
    expect(() => timeToSeconds('10:00:00')).to.not.throw(Error);
  });
});
