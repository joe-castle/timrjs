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
  it('Throws an error if the provided time is not the correct format.', () => {
    expect(timeToSeconds.bind(timeToSeconds, 'asdsd')).to.throw(Error);
    expect(timeToSeconds.bind(timeToSeconds, 'asdsd')).to.throw('Warning! Provided time is not in the correct format. Expected time format (HH:MM:SS, MM:SS or SS), instead got: asdsd');
  })
});
