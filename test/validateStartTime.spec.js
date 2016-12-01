import { expect } from 'chai';

import validateStartTime from '../src/validateStartTime';

describe('Validate function', () => {
  it('Throws an error if provided time is not valid', () => {
    expect(validateStartTime.bind(validateStartTime, 'boom')).to.throw(
      'Expected time to be in (hh:mm:ss) format, instead got: boom'
    );
    expect(validateStartTime.bind(validateStartTime, {})).to.throw(
      'Expected time to be a string or number, instead got: object'
    );
    expect(validateStartTime.bind(validateStartTime, -1)).to.throw(
      'Time cannot be a negative number, got: -1'
    );
    expect(validateStartTime.bind(validateStartTime, NaN)).to.throw(
      'Expected time to be a string or number, instead got: NaN'
    );
    expect(validateStartTime.bind(validateStartTime, Infinity)).to.throw(
      'Expected time to be a string or number, instead got: Infinity'
    );
    expect(validateStartTime.bind(validateStartTime, -Infinity)).to.throw(
      'Expected time to be a string or number, instead got: -Infinity'
    );
    expect(validateStartTime.bind(validateStartTime, null)).to.throw(
      'Expected time to be a string or number, instead got: null'
    );
  });
  it('Throws if the provided time is over a 999:59:59', () => {
    expect(validateStartTime.bind(validateStartTime, 3600000)).to.throw(Error);
    expect(validateStartTime.bind(validateStartTime, '3600000')).to.throw(Error);
    expect(validateStartTime.bind(validateStartTime, '3600000')).to.throw(
      'Sorry, we don\'t support any time over 999:59:59.'
    );
  });
  it('Does not throw an error when the time is valid', () => {
    expect(validateStartTime.bind(validateStartTime, 600)).to.not.throw(Error);
    expect(validateStartTime.bind(validateStartTime, '600')).to.not.throw(Error);
    expect(validateStartTime.bind(validateStartTime, '10:00')).to.not.throw(Error);
  });
  it('Returns the original number or the converted number if a time string was provided', () => {
    expect(validateStartTime(600)).to.equal(600);
    expect(validateStartTime('10:00')).to.equal(600);
    expect(validateStartTime('10m')).to.equal(600);
    expect(validateStartTime('10h')).to.equal(36000);
  });
});
