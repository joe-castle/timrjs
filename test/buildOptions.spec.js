import { expect } from 'chai';

import buildOptions from '../src/buildOptions';

describe('Build Options Function', () => {
  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal(
      { formatType: 'h', outputFormat: 'mm:ss', separator: ':', countdown: true }
    );
  });

  it('Returns an object with amended outputFormat option', () => {
    expect(buildOptions({ outputFormat: 'ss' })).to.deep.equal(
      { formatType: 'h', outputFormat: 'ss', separator: ':', countdown: true }
    );
    expect(buildOptions({ outputFormat: 'hh:mm:ss' })).to.deep.equal(
      { formatType: 'h', outputFormat: 'hh:mm:ss', separator: ':', countdown: true }
    );
  });

  it('Throws an error when outputFormat is invalid', () => {
    expect(buildOptions.bind(buildOptions, { outputFormat: 'invalid' })).to.throw(
      'Expected outputFormat to be: hh:mm:ss, mm:ss (default) or ss; instead got: invalid'
    );
  });

  it('Returns an object with amended separator option', () => {
    expect(buildOptions({ separator: '-' })).to.deep.equal(
      { formatType: 'h', outputFormat: 'mm:ss', separator: '-', countdown: true }
    );
    expect(buildOptions({ separator: 'boop' })).to.deep.equal(
      { formatType: 'h', outputFormat: 'mm:ss', separator: 'boop', countdown: true }
    );
  });

  it('Throws an error if value provided to separator is not a string', () => {
    expect(buildOptions.bind(buildOptions, { separator: () => {} })).to.throw(
      'Expected separator to be a string, instead got: function'
    );
  });

  it('Throws an error if formatType is not h, m or s', () => {
    expect(buildOptions.bind(buildOptions, { formatType: 'hey' })).to.throw(
      'Expected formatType to be: h, m or s; instead got: hey'
    );
  });

  it('Returns an object with amended formatType option', () => {
    expect(buildOptions({ formatType: 'm' })).to.deep.equal(
      { formatType: 'm', outputFormat: 'mm:ss', separator: ':', countdown: true }
    );
    expect(buildOptions({ formatType: 's' })).to.deep.equal(
      { formatType: 's', outputFormat: 'mm:ss', separator: ':', countdown: true }
    );
  });

  it('Returns an object with amended countdown option', () => {
    expect(buildOptions({ countdown: false })).to.deep.equal(
      { formatType: 'h', outputFormat: 'mm:ss', separator: ':', countdown: false }
    );
  });
});
