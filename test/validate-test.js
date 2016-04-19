'use strict';

const expect = require('chai').expect;

const validate = require('../src/validate');

describe('Validate function', () => {
  it('Throws an error if provided time is not valid', () => {
    expect(validate.bind(validate, 'boom')).to.throw(Error);
    expect(validate.bind(validate, 'boom')).to.throw(
      'Expected a time string, instead got: boom'
    );
    expect(validate.bind(validate, {})).to.throw(
      'Expected time to be a string or number, instead got: object'
    );
    expect(validate.bind(validate, NaN)).to.throw(
      'Expected time to be a string or number, instead got: NaN'
    );
  });
  it('Throws if the provided time in seconds is over a 999:59:59', () => {
    expect(validate.bind(validate, 3600000)).to.throw(Error);
    expect(validate.bind(validate, '3600000')).to.throw(Error);
    expect(validate.bind(validate, '3600000')).to.throw(
      `Sorry, we don't support any time over 999:59:59.`
    );
  });
  it('Does not throw an error when the time is valid', () => {
    expect(validate.bind(validate, 600)).to.not.throw(Error);
    expect(validate.bind(validate, '600')).to.not.throw(Error);
    expect(validate.bind(validate, '10:00')).to.not.throw(Error);
  });
  it(`Returns the original number or the converted number
    if a time string was provided`, () => {
    expect(validate(600)).to.equal(600);
    expect(validate('10:00')).to.equal(600);
    expect(validate('10m')).to.equal(600);
    expect(validate('10h')).to.equal(36000);
  });
});
