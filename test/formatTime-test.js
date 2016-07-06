const expect = require('chai').expect;

const formatTime = require('../src/utils/formatTime');

describe('Format Time function', () => {
  it('Returns the currentTime formatted into a time string', () => {
    expect(formatTime(50)).to.equal('00:50');
    expect(formatTime(600)).to.equal('10:00');
    expect(formatTime(9600)).to.equal('02:40:00');
  });

  it('Returns the currentTime formatted into a time string witha modified outputFormat', () => {
    expect(formatTime(600, null, 'HH:MM:SS')).to.equal('00:10:00');
    expect(formatTime(50, null, 'SS')).to.equal('50');
  });

  it('Returns the currentTime formatted into a time string witha modifided separator', () => {
    expect(formatTime(600, '-')).to.equal('10-00');
    expect(formatTime(600, 'boop')).to.equal('10boop00');
  });

  it('Returns the currentTime formatted into a time string with a modifided formatType', () => {
    expect(formatTime(5500, null, null, 'm')).to.equal('91:40');
    expect(formatTime(5500, null, null, 's')).to.equal('5500');
  });

  it('Returns the correct formatting with a mixture of differentsettings applied.', () => {
    expect(formatTime(5500, null, 'HH:MM:SS', 'm')).to.equal('00:91:40');
    expect(formatTime(5500, '-', 'HH:MM:SS', 'm')).to.equal('00-91-40');
    expect(formatTime(5500, '_', 'MM:SS')).to.equal('01_31_40');
    expect(formatTime(5500, '()', 'SS', 's')).to.equal('5500');
    expect(formatTime(5500, '$', 'HH:MM:SS', 'h')).to.equal('01$31$40');
  });
});
