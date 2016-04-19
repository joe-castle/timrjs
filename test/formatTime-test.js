'use strict';

const expect = require('chai').expect;

const formatTime = require('../src/utils/formatTime');

describe('Format Time function', () => {
  it('Returns the currentTime formatted into a time string', () => {
    expect(formatTime(50)).to.equal('00:50');
    expect(formatTime(600)).to.equal('10:00');
    expect(formatTime(9600)).to.equal('02:40:00');
  });
  it(`Returns the currentTime formatted into a time string with
    a modified outputFormat`, () => {
    expect(formatTime(600, null, 'HH:MM:SS')).to.equal('00:10:00');
    expect(formatTime(50, null, 'SS')).to.equal('50');
  });
  it(`Returns the currentTime formatted into a time string with
    a modifided separator`, () => {
    expect(formatTime(600, '-')).to.equal('10-00');
    expect(formatTime(600, 'boop')).to.equal('10boop00');
  });
});
