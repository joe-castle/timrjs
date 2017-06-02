import { expect } from 'chai';

import formatTime from '../src/formatTime';

describe('Format Time function', () => {
  it('Returns seconds formatted into a time string. Days are\'nt padded', () => {
    expect(formatTime(50).formattedTime).to.equal('00:50');
    expect(formatTime(600).formattedTime).to.equal('10:00');
    expect(formatTime(9600).formattedTime).to.equal('02:40:00');
    expect(formatTime(96000, { formatOutput: 'DD' }).formattedTime).to.equal('1');
  });

  it('Returns an object with seconds formatted into a time string and the raw ' +
   'values as string type', () => {
    expect(formatTime(600).formattedTime).to.equal('10:00');
    expect(formatTime(600).raw.hh).to.equal('00');
    expect(formatTime(600).raw.mm).to.equal('10');
    expect(formatTime(600).raw.ss).to.equal('00');
  });

  it('Returns an object with the raw values un padded and as number type', () => {
    expect(formatTime(600, { padRaw: false }).raw.hh).to.equal(0);
    expect(formatTime(600, { padRaw: false }).raw.mm).to.equal(10);
    expect(formatTime(600, { padRaw: false }).raw.ss).to.equal(0);
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
    ).to.equal('1 days 03 hours 46 minutes 39 seconds');
  });
});
