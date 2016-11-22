import { expect } from 'chai';

import formatTime from '../src/formatTime';

describe('Format Time function', () => {
  it('Returns the currentTime formatted into a time string', () => {
    expect(formatTime(50)).to.equal('00:50');
    expect(formatTime(600)).to.equal('10:00');
    expect(formatTime(9600)).to.equal('02:40:00');
  });

  it('Returns the currentTime formatted into a time string with a modified outputFormat', () => {
    expect(formatTime(600, { outputFormat: 'HH:MM:SS' })).to.equal('00:10:00');
    expect(formatTime(50, { outputFormat: 'SS' })).to.equal('50');
  });

  it('Returns the currentTime formatted into a time string witha modifided separator', () => {
    expect(formatTime(600, { separator: '-' })).to.equal('10-00');
    expect(formatTime(600, { separator: 'boop' })).to.equal('10boop00');
  });

  it('Returns the currentTime formatted into a time string with a modifided formatType', () => {
    expect(formatTime(5500, { formatType: 'm' })).to.equal('91:40');
    expect(formatTime(5500, { formatType: 's' })).to.equal('5500');
  });

  it('Returns the correct formatting with a mixture of differentsettings applied.', () => {
    expect(formatTime(5500, { formatType: 'm', outputFormat: 'HH:MM:SS' })).to.equal('00:91:40');
    expect(formatTime(5500, { formatType: 'm', outputFormat: 'HH:MM:SS', separator: '-' }))
      .to.equal('00-91-40');
    expect(formatTime(5500, { outputFormat: 'MM:SS', separator: '_' })).to.equal('01_31_40');
    expect(formatTime(5500, { formatType: 's', outputFormat: 'SS', separator: '()' }))
      .to.equal('5500');
    expect(formatTime(5500, { formatType: 'h', outputFormat: 'HH:MM:SS', separator: '$' }))
      .to.equal('01$31$40');
  });
});
