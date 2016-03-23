'use strict'

const expect = require('chai').expect;

const validate = require('../lib/validate');

describe('Validate function', () => {
  it('Throws an error if provided time is not valid', () => {
    expect(validate.bind(validate, 'boom')).to.throw(Error);
    expect(validate.bind(validate, 'boom')).to.throw('Expected time format (HH:MM:SS, MM:SS or SS), instead got: boom');
    expect(validate.bind(validate, {})).to.throw('Expected time to be a string or number, instead got: object');
  });
  it('Does not throw an error when the time is valud', () => {
    expect(validate.bind(validate, 600)).to.not.throw(Error);
    expect(validate.bind(validate, '10:00')).to.not.throw(Error);
  });
});
