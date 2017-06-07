import { expect } from 'chai';

import formatTime from '../src/formatTime';

describe('Format Time function', () => {
  it('Returns seconds formatted into a time string.', () => {
    expect(formatTime(50).formattedTime).to.equal('00:50');
    expect(formatTime(600).formattedTime).to.equal('10:00');
    expect(formatTime(9600).formattedTime).to.equal('02:40:00');
    expect(formatTime(96000, { formatOutput: 'DD' }).formattedTime).to.equal('01');
  });

  it('Returns an object of raw values', () => {
    expect(formatTime(600).formattedTime).to.equal('10:00');
    expect(formatTime(600).raw.hh).to.be.a('number');
    expect(formatTime(600).raw.hh).to.equal(0);
    expect(formatTime(600).raw.mm).to.equal(10);
    expect(formatTime(600).raw.ss).to.equal(0);
  });

  it('Returns the correct formatting with a mixture of different formatOutput strings.', () => {
    expect(formatTime(5500, { formatOutput: '00:MM:ss' }).formattedTime).to.equal('00:91:40');
    expect(formatTime(5500, { formatOutput: '00-MM-ss' }).formattedTime).to.equal('00-91-40');
    expect(formatTime(5500, { formatOutput: 'HH_mm_ss' }).formattedTime).to.equal('01_31_40');
    expect(formatTime(5500, { formatOutput: 'SS' }).formattedTime).to.equal('5500');
    expect(formatTime(5500, { formatOutput: 'HH$mm$ss' }).formattedTime).to.equal('01$31$40');
    expect(formatTime(999999, { formatOutput: 'dd days hh:mm:ss' }).formattedTime)
      .to.equal('11 days 13:46:39');
    expect(formatTime(999999, { formatOutput: 'dd days hh:mm:ss' }).formattedTime)
      .to.equal('11 days 13:46:39');
    expect(
      formatTime(99999, { formatOutput: 'dd days hh hours mm minutes ss seconds' }).formattedTime,
    ).to.equal('01 days 03 hours 46 minutes 39 seconds');
  });

  it('Returns the correct formatting with a mixture of different formatValues and formatOutput strings', () => {
    expect(formatTime(5500, { formatOutput: '00:MM:ss', formatValues: i => i * 2 }).formattedTime).to.equal('00:182:80');
    expect(formatTime(600, { formatValues: i => `0${i}0` }).formattedTime).to.equal('0100:000');
    expect(formatTime(96000, { formatValues: { DD: i => i } }).formattedTime).to.equal('1 02:40:00');

    expect(formatTime(96000, {
      formatOutput: 'DD day hh hours mm minutes ss seconds',
      formatValues: {
        DD: i => `00${i}`,
        hh: i => `${i}00`,
        mm: i => i * 2,
        ss: i => i,
      },
    }).formattedTime).to.equal('001 day 200 hours 80 minutes 0 seconds');
  });
});
