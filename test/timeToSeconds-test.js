'use strict';

const expect = require('chai').expect;

const timeToSeconds = require('../lib/timeToSeconds');

describe('Time To Seconds function', () => {
  it('Converts the provided time (string) to seconds (number)', () => {
    expect(timeToSeconds('10:00')).to.equal(600);
    expect(timeToSeconds('10:00')).to.be.a('number');

    expect(timeToSeconds('50')).to.equal(50);

    expect(timeToSeconds('02:40:00')).to.equal(9600);
  });
});
