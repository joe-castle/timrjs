'use strict'

const expect = require('chai').expect;

const timrInit = require('../lib/index');
const Timr = require('../lib/Timr');

describe('Index / Init function', () => {
  it('Creates a new Timr object if the provided argument is a number or string. Defaults to 0 if no argument provided.', () => {
    expect(timrInit('10:00')).to.be.an.instanceof(Timr);
    expect(timrInit(600)).to.be.an.instanceof(Timr);
    expect(timrInit()).to.be.an.instanceof(Timr);
  });
  it('Throws an error if the provided argument is not a number or a string', () => {
    expect(timrInit.bind(timrInit, {})).to.throw(Error);
    expect(timrInit.bind(timrInit, {})).to.throw('the starting time needs to be a number');
  });
});
