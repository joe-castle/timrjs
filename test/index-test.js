'use strict';

const expect = require('chai').expect;

const init = require('../lib/index');
const Timr = require('../lib/Timr');

describe('Init function', () => {
  it('Returns a new timr object.', () => {
    expect(init('10:00')).to.be.an.instanceof(Timr);
    expect(init(600)).to.be.an.instanceof(Timr);
    expect(init(0)).to.be.an.instanceof(Timr);
  });
});
