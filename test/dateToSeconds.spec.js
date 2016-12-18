import { expect } from 'chai';

import dateToSeconds from '../src/dateToSeconds';

const zeroPad = number => (number < 10 ? `0${number}` : number);

describe('Date to Seconds function', () => {
  it('When passed a date and time, it returns an object with the parsed seconds and original date',
  () => {
    const year = new Date().getFullYear() + 1;

    const testStartTime2 = Math.ceil((Date.parse(`${year}-05-15T14:00:00`) - Date.now()) / 1000);
    expect(dateToSeconds(`${year}-05-15T14:00:00`).parsed).to.equal(testStartTime2);
    expect(dateToSeconds(`${year}-05-15T14:00:00`).originalDate).to.equal(`${year}-05-15T14:00:00`);
  });

  it('When passed just a date, it returns the seconds to that point in time', () => {
    const year = new Date().getFullYear() + 1;

    const testStartTime2 = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000);
    expect(dateToSeconds(`${year}-12-15`).parsed).to.equal(testStartTime2);
  });

  it('When passed a unix time, it returns the seconds to that point in time', () => {
    const testTime = Date.now() + 36000;

    const testStartTime1 = Math.ceil((testTime - Date.now()) / 1000);
    expect(dateToSeconds(testTime).parsed).to.equal(testStartTime1);
  });

  it('When passing a timezone offset, it returns the seconds to that point in time.', () => {
    const year = new Date().getFullYear() + 1;

    expect(() => dateToSeconds(`${year}-12-25T10:00:00-05:00`)).to.not.throw();
    expect(() => dateToSeconds(`${year}-12-25T10:00:00+05:00`)).to.not.throw();
    expect(() => dateToSeconds(`${year}-12-25T10:00:00Z`)).to.not.throw();
  });

  it('Returns the original value if it does not match the regex', () => {
    expect(dateToSeconds('howdo')).to.equal('howdo');
    expect(dateToSeconds({})).to.be.a('object');
  });

  it('Returns the original value if it\'s a number that is less than 2 years. Anythiung over ' +
  'is assumed to be a unix time', () => {
    expect(dateToSeconds(63071999999)).to.equal(63071999999)
  });

  it('Throws an error if the format matches the regex but is not ISO format', () => {
    const year = new Date().getFullYear() + 1;

    expect(() => dateToSeconds(`${year}-13-25`)).to.throw(
      'The date/time you passed does not match ISO format. ' +
      `You passed: "${year}-13-25".`
    );
  });

  it('Throws an error if the passed date is in the past', () => {
    const dateNow = new Date();

    expect(() => dateToSeconds('2015-12-25')).to.throw(
      'When passing a date/time, it cannot be in the past. ' +
      'You passed: "2015-12-25". It\'s currently: "' +
      `${zeroPad(dateNow.getFullYear())}-${zeroPad(dateNow.getMonth() + 1)}-` +
      `${zeroPad(dateNow.getDate())} ` +
      `${zeroPad(dateNow.getHours())}:${zeroPad(dateNow.getMinutes())}:` +
      `${zeroPad(dateNow.getSeconds())}"`
    );
  });
});
