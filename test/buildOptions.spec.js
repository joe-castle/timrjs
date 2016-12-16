import { expect } from 'chai';

import buildOptions from '../src/buildOptions';

describe('Build Options Function', () => {
  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal({
      formatOutput: 'HH:{mm:ss}',
      padRaw: true,
      countdown: true,
    });
  });

  it('Returns an object with amended formatOutput option', () => {
    expect(buildOptions({ formatOutput: 'HH:MM:SS' })).to.deep.equal(
      { formatOutput: 'HH:MM:SS', padRaw: true, countdown: true }
    );
    expect(buildOptions({ formatOutput: 'DD day hh:mm:ss' })).to.deep.equal(
      { formatOutput: 'DD day hh:mm:ss', padRaw: true, countdown: true }
    );
  });

  it('Throws an error if formatOutput is not a string', () => {
    expect(() => buildOptions({ formatOutput: 5 })).to.throw(
      'Expected formatOutput to be a string; instead got: number'
    );
  });

  it('Returns an object with amended padRaw option', () => {
    expect(buildOptions({ padRaw: false })).to.deep.equal(
      { formatOutput: 'HH:{mm:ss}', padRaw: false, countdown: true }
    );
  });

  it('Throws an error if padRaw is not a boolean', () => {
    expect(() => buildOptions({ padRaw: 5 })).to.throw(
      'Expected padRaw to be a boolean; instead got: number'
    );
  });

  it('Returns an object with amended countdown option', () => {
    expect(buildOptions({ countdown: false })).to.deep.equal(
      { formatOutput: 'HH:{mm:ss}', padRaw: true, countdown: false }
    );
  });

  it('Throws an error if countdown is not a boolean', () => {
    expect(() => buildOptions({ countdown: 'hey' })).to.throw(
      'Expected countdown to be a boolean; instead got: string'
    );
  });
});
