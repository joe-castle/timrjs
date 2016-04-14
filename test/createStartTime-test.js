'use strict';

const expect = require('chai').expect;

const createStartTime = require('../lib/createStartTime');

describe('Create Start Time Function', () => {
  it('Throws an error if the time is invalid', () => {
    expect(createStartTime.bind(createStartTime, '10:80')).to.throw(Error);
    expect(createStartTime.bind(createStartTime, '70:10:00')).to.throw(Error);
    expect(createStartTime.bind(createStartTime, 3459230523213)).to.throw(Error);
  });
  it('Returns the startTime in seconds, converted if string is provided.', () => {
    expect(createStartTime('10:00')).to.equal(600);
    expect(createStartTime(1600)).to.equal(1600);
    expect(createStartTime('09')).to.equal(9);
  })
});
