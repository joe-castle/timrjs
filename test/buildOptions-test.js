'use strict';

const expect = require('chai').expect;

const buildOptions = require('../lib/buildOptions');

describe('Build Options Function', () => {
  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal(
      {outputFormat: 'MM:SS', separator: ':'}
    );
  });
  it('Returns an object with amended outputFormat option', () => {
    expect(buildOptions({outputFormat: 'SS'})).to.deep.equal(
      {outputFormat: 'SS', separator: ':'}
    );
    expect(buildOptions({outputFormat: 'HH:MM:SS'})).to.deep.equal(
      {outputFormat: 'HH:MM:SS', separator: ':'}
    );
  });
  it('Throws an error when outputFormat is not a string', () => {
    expect(buildOptions.bind(buildOptions, {outputFormat: {}}))
      .to.throw(TypeError);
    expect(buildOptions.bind(buildOptions, {outputFormat: {}})).to.throw(
      'Expected outputFormat to be a string, instead got: object'
    );
  });
  it('Throws an error when outputFormat is invalid', () => {
    expect(buildOptions.bind(buildOptions, {outputFormat: 'invalid'}))
      .to.throw(Error);
    expect(buildOptions.bind(buildOptions, {outputFormat: 'invalid'})).to.throw(
      'Expected outputFormat to be: HH:MM:SS, MM:SS (default) ' +
      'or SS, instead got: invalid'
    );
  });
  it('Returns an object with amended separator option', () => {
    expect(buildOptions({separator: '-'})).to.deep.equal(
      {outputFormat: 'MM:SS', separator: '-'}
    );
    expect(buildOptions({separator: 'boop'})).to.deep.equal(
      {outputFormat: 'MM:SS', separator: 'boop'}
    );
  });
  it('Throws an error if value provided to separator is not a string', () => {
    expect(buildOptions.bind(buildOptions, {separator: () => {}}))
      .to.throw(TypeError);
    expect(buildOptions.bind(buildOptions, {separator: () => {}})).to.throw(
      'Expected separator to be a string, instead got: function'
    );
  });
});
