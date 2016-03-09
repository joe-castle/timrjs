'use strict';

const expect = require('chai').expect;

const zeroPad = require('../lib/zeroPad');

describe('Zero Pad function', () => {
  it('Adds a 0 to the beginning of the provided number is a single digit', () => {
    expect(zeroPad(5)).to.equal('05');
  });
  it('Returns the provided number if its 2 digits or more', () => {
    expect(zeroPad(14)).to.equal(14);
  })
});
