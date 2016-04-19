'use strict';

const expect = require('chai').expect;

const buildOptions = require('../src/buildOptions');

describe('Build Options Function', () => {
  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal(
      {formatType: 'h', outputFormat: 'MM:SS', separator: ':'}
    );
  });
  it('Returns an object with amended outputFormat option', () => {
    expect(buildOptions({outputFormat: 'SS'})).to.deep.equal(
      {formatType: 'h', outputFormat: 'SS', separator: ':'}
    );
    expect(buildOptions({outputFormat: 'HH:MM:SS'})).to.deep.equal(
      {formatType: 'h', outputFormat: 'HH:MM:SS', separator: ':'}
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
      'or SS; instead got: invalid'
    );
  });
  it('Returns an object with amended separator option', () => {
    expect(buildOptions({separator: '-'})).to.deep.equal(
      {formatType: 'h', outputFormat: 'MM:SS', separator: '-'}
    );
    expect(buildOptions({separator: 'boop'})).to.deep.equal(
      {formatType: 'h', outputFormat: 'MM:SS', separator: 'boop'}
    );
  });
  it('Throws an error if value provided to separator is not a string', () => {
    expect(buildOptions.bind(buildOptions, {separator: () => {}}))
      .to.throw(TypeError);
    expect(buildOptions.bind(buildOptions, {separator: () => {}})).to.throw(
      'Expected separator to be a string, instead got: function'
    );
  });
  it('Throws an error if formatType is not a string', () => {
    expect(buildOptions.bind(buildOptions, {formatType: 5}))
      .to.throw(TypeError)
    expect(buildOptions.bind(buildOptions, {formatType: 5}))
      .to.throw('Expected formatType to be a string, instead got: number')
  });
  it('Throws an error if formatType is not h, m or s', () => {
    expect(buildOptions.bind(buildOptions, {formatType: 'hey'}))
      .to.throw(Error)
    expect(buildOptions.bind(buildOptions, {formatType: 'hey'}))
      .to.throw('Expected formatType to be: h, m or s; instead got: hey')
  });
  it('Returns an object with amended formatType option', () => {
    expect(buildOptions({formatType: 'm'})).to.deep.equal(
      {formatType: 'm', outputFormat: 'MM:SS', separator: ':'}
    );
    expect(buildOptions({formatType: 's'})).to.deep.equal(
      {formatType: 's', outputFormat: 'MM:SS', separator: ':'}
    );
  });
});
