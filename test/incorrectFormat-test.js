'use strict';

const expect = require('chai').expect;

const incorrectFormat = require('../lib/utils/incorrectFormat');

describe('Incorrect Format function', () => {
  it('Returns true of the provided time is not the correct format', () => {
    expect(incorrectFormat('10:80')).to.equal(true);
    expect(incorrectFormat('70:10:00')).to.equal(true);
    expect(incorrectFormat('10-00')).to.equal(true);
  });
  it('Returns false if the provided time is in the correct format', () => {
    expect(incorrectFormat('10:00')).to.equal(false);
    expect(incorrectFormat('07:10:00')).to.equal(false);
    expect(incorrectFormat('09')).to.equal(false);
  })
});
