'use strict';

const expect = require('chai').expect;

const buildOptions = require('../lib/buildOptions');

describe('Build Options Function', () => {
  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal({outputFormat: 'MM:SS'});
  });
  it('Returns an object with amended outputFormat option', () => {
    expect(buildOptions({outputFormat: 'SS'})).to.deep.equal({outputFormat: 'SS'})
    expect(buildOptions({outputFormat: 'HH:MM:SS'})).to.deep.equal({outputFormat: 'HH:MM:SS'})
  });
  it('Throws an error when outputFormat is invalid', () => {
    expect(buildOptions.bind(buildOptions, {outputFormat: 'invalid'})).to.throw(Error)
    expect(buildOptions.bind(buildOptions, {outputFormat: 'invalid'})).to.throw('Incorrect outputFormat, expected - HH:MM:SS, MM:SS or SS')
  })
});
