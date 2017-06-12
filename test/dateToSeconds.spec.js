import { expect } from 'chai';

import dateToSeconds from '../src/dateToSeconds';

const zeroPad = number => (number < 10 ? `0${number}` : number);

describe('Date to Seconds function', () => {
  it('When passed a date and time, it returns seconds to that time from now.', () => {
    const year = new Date().getFullYear() + 1;
    const testStartTime = Math.ceil((Date.parse(`${year}-05-15T14:00:00`) - Date.now()) / 1000);

    expect(dateToSeconds(`${year}-05-15T14:00:00`)).to.equal(testStartTime);
  });

  it('When passed just a date, it returns the seconds to that point in time', () => {
    const year = new Date().getFullYear() + 1;
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000);

    expect(dateToSeconds(`${year}-12-15`)).to.equal(testStartTime);
  });

  it('When passed a unix time, it returns the seconds to that point in time', () => {
    const testTime = Date.now() + 36000;
    const testStartTime = Math.ceil((testTime - Date.now()) / 1000);

    expect(dateToSeconds(testTime)).to.equal(testStartTime);
  });

  it('When passing a timezone offset, it returns the seconds to that point in time.', () => {
    const year = new Date().getFullYear() + 1;
    const testStartTime1 = Math.ceil((Date.parse(`${year}-12-25T10:00:00-05:00`) - Date.now()) / 1000);
    const testStartTime2 = Math.ceil((Date.parse(`${year}-12-25T10:00:00+05:00`) - Date.now()) / 1000);
    const testStartTime3 = Math.ceil((Date.parse(`${year}-12-25T10:00:00Z`) - Date.now()) / 1000);

    expect(dateToSeconds(`${year}-12-25T10:00:00-05:00`)).to.equal(testStartTime1);
    expect(dateToSeconds(`${year}-12-25T10:00:00+05:00`)).to.equal(testStartTime2);
    expect(dateToSeconds(`${year}-12-25T10:00:00Z`)).to.equal(testStartTime3);
  });

  it('Throws an error if the value passed does not match the date/time pattern.', () => {
    expect(() => dateToSeconds('howdo')).to.throw(
      'The provided date is not in the right format.\n' +
      'Expected a string in the format: YYYY-MM-DDTHH:MM:SS-01:00.\n' +
      '(year)-(month)-(day)T(hour):(minute):(second)(-timezone)\n' +
      'Time is optional, but must seperate the date with a T (exclude the T if only providing a date).\n' +
      'Seconds and the timezone are also optional.\n' +
      'You passed: "howdo"',
    );
  });

  it('Throws an error if the format matches the regex but an error occured, like mixing up the month and day', () => {
    const year = new Date().getFullYear() + 1;

    expect(() => dateToSeconds(`${year}-13-25`)).to.throw(
      'Something went wrong parsing the date. Did you mix up the month and day?\n' +
      'Format should follow: YYYY-MM-DDTHH:MM:SS-01:00. Note: Time, seconds and timezone are optional.\n' +
      `You passed: "${year}-13-25".`,
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
      `${zeroPad(dateNow.getSeconds())}"`,
    );
  });
});
