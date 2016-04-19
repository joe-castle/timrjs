'use strict';

const expect = require('chai').expect;

const zeroPad = require('../src/utils/zeroPad');

describe('Zero Pad function', () => {
  it('Pads out single digits in a time string with a 0', () => {
    expect(zeroPad('10:5:23')).to.equal('10:05:23');
    expect(zeroPad('1:5:2')).to.equal('01:05:02');
    expect(zeroPad('10:7')).to.equal('10:07');
    expect(zeroPad('5')).to.equal('05');
  });
});
