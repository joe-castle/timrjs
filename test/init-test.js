'use strict'

const expect = require('chai').expect;

const init = require('../lib/init');
const Timr = require('../lib/Timr');

describe('Init function', () => {
  it('Creates a new Timr object if the provided argument is a number or string. Defaults to 0 if no argument provided.', () => {
    expect(init('10:00')).to.be.an.instanceof(Timr);
    expect(init(600)).to.be.an.instanceof(Timr);
    expect(init()).to.be.an.instanceof(Timr);
  });
  it('Throws an error if the provided argument is not a number or a string', () => {
    expect(init.bind(init, {})).to.throw(TypeError);
    expect(init.bind(init, {})).to.throw('The starting time needs to be a number');
  });
  it('Throws an error if the provided argument is not correct time format', () => {
    expect(init.bind(init, '10:80')).to.throw(Error);
    expect(init.bind(init, '10:80')).to.throw('Provided time is not in the correct format');
  })
});
