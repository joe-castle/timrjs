import { expect } from 'chai';

import validateStartTime from '../src/validateStartTime';

describe('Validate function', () => {
  it('Throws an error if provided time is not valid', () => {
    expect(() => validateStartTime('boom')).to.throw(
      'Expected time to be in (hh:mm:ss) format, instead got: boom'
    );
    expect(() => validateStartTime({})).to.throw(
      'Expected time to be a string or number, instead got: object'
    );
    expect(() => validateStartTime(() => {})).to.throw(
      'Expected time to be a string or number, instead got: function'
    );
    expect(() => validateStartTime(-1)).to.throw(
      'Time cannot be a negative number, got: -1'
    );
    expect(() => validateStartTime(NaN)).to.throw(
      'Expected time to be a string or number, instead got: NaN'
    );
    expect(() => validateStartTime(Infinity)).to.throw(
      'Expected time to be a string or number, instead got: Infinity'
    );
    expect(() => validateStartTime(-Infinity)).to.throw(
      'Expected time to be a string or number, instead got: -Infinity'
    );
    expect(() => validateStartTime(null)).to.throw(
      'Expected time to be a string or number, instead got: null'
    );
  });

  it('Does not throw an error when the time is valid', () => {
    expect(() => validateStartTime(600)).to.not.throw(Error);
    expect(() => validateStartTime('600')).to.not.throw(Error);
    expect(() => validateStartTime('10:00')).to.not.throw(Error);
    expect(() => validateStartTime('10:00:00')).to.not.throw(Error);
  });

  it('Returns the original number or the converted number if a time string was provided', () => {
    expect(validateStartTime(600)).to.equal(600);
    expect(validateStartTime('10:00')).to.equal(600);
    expect(validateStartTime('10m')).to.equal(600);
    expect(validateStartTime('10h')).to.equal(36000);
  });
});
