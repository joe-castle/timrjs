import { expect } from 'chai';

import buildOptions from '../src/buildOptions';
import zeroPad from '../src/zeroPad';

describe('Build Options Function', () => {
  const timeValues = ['ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD'];
  const defaultFormatValues = timeValues.reduce((obj, item) => ({
    ...obj,
    [item]: zeroPad,
  }), {});

  it('Returns an object with default options.', () => {
    expect(buildOptions()).to.deep.equal({
      formatOutput: 'DD hh:{mm:ss}',
      countdown: true,
      formatValues: defaultFormatValues,
    });
  });

  it('Returns an object with amended formatOutput option', () => {
    expect(buildOptions({ formatOutput: 'HH:MM:SS' })).to.deep.equal(
      { formatOutput: 'HH:MM:SS', formatValues: defaultFormatValues, countdown: true },
    );
    expect(buildOptions({ formatOutput: 'DD day hh:mm:ss' })).to.deep.equal(
      { formatOutput: 'DD day hh:mm:ss', formatValues: defaultFormatValues, countdown: true },
    );
  });

  it('Throws an error if formatOutput is not a string', () => {
    expect(() => buildOptions({ formatOutput: 5 })).to.throw(
      'Expected formatOutput to be a string; instead got: number',
    );
  });

  it('Returns an object with amended countdown option', () => {
    expect(buildOptions({ countdown: false })).to.deep.equal(
      { formatOutput: 'DD hh:{mm:ss}', formatValues: defaultFormatValues, countdown: false },
    );
  });

  it('Throws an error if countdown is not a boolean', () => {
    expect(() => buildOptions({ countdown: 'hey' })).to.throw(
      'Expected countdown to be a boolean; instead got: string',
    );
  });

  it('Returns an object with a function passed to formatValues', () => {
    const obj = buildOptions({ formatValues: () => 5 });

    expect(obj).to.be.an('object');
    expect(obj.formatOutput).to.equal('DD hh:{mm:ss}');
    expect(obj.countdown).to.equal(true);

    expect(obj.formatValues).to.have.all.keys(timeValues);

    Object.keys(obj.formatValues).forEach((key) => {
      const value = obj.formatValues[key];

      expect(value).to.be.a('function');
      expect(value()).to.equal(5);
    });
  });

  it('Returns an object with an object of functions passed to formatValues', () => {
    const obj = buildOptions({
      formatValues: {
        ss: i => i * 2,
        mm: i => `yo-${i}-yo`,
        hh: i => i,
      },
    });

    expect(obj).to.be.an('object');
    expect(obj.formatOutput).to.equal('DD hh:{mm:ss}');
    expect(obj.countdown).to.equal(true);

    expect(obj.formatValues).to.have.all.keys(timeValues);

    expect(obj.formatValues.ss(2)).to.equal(4);
    expect(obj.formatValues.mm(2)).to.equal('yo-2-yo');
    expect(obj.formatValues.hh(2)).to.equal(2);
    expect(obj.formatValues.HH(2)).to.equal('02');
  });

  it('Returns an object with the formatValues changed and the correct mix of old and new options', () => {
    const oldOptions = buildOptions({
      formatValues: {
        ss: i => i,
        mm: i => i * 2,
      },
    });
    const newOptions = buildOptions({
      formatValues: {
        mm: i => i * 3,
        hh: i => i * 4,
      },
    }, oldOptions);

    expect(newOptions).to.be.an('object');
    expect(newOptions.formatOutput).to.equal('DD hh:{mm:ss}');
    expect(newOptions.countdown).to.equal(true);

    expect(newOptions.formatValues).to.have.all.keys(timeValues);

    expect(newOptions.formatValues.ss(2)).to.equal(2);
    expect(newOptions.formatValues.mm(2)).to.equal(6);
    expect(newOptions.formatValues.hh(2)).to.equal(8);
    expect(newOptions.formatValues.HH(2)).to.equal('02');
  });

  it('Throws an error if formatValues is neither an object nor a function', () => {
    expect(() => buildOptions({ formatValues: 'Not a function or object.' })).to.throw(
      'Expected formatValues to be a function or an object of functions; instead got: string',
    );
  });

  it('Throws an error if formatValues is a function, but it\'s return type is neither a string nor a number', () => {
    expect(() => buildOptions({ formatValues: () => null })).to.throw(
      'Expected the return value from formatValues function to be of type string or number; instead got: null',
    );
  });

  /* eslint-disable quotes */
  it('Throws an error if formatValues is an object, but one of it\'s keys are invalid', () => {
    expect(() => buildOptions({ formatValues: { invalidKey: 'wey' } })).to.throw(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'invalidKey': is not a recognised property, should be one of: 'ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD'`,
    );
  });

  it('Throws an error if formatValues is an object, but one of its properties isn\'t a function', () => {
    expect(() => buildOptions({ formatValues: { mm: 'Not a function yo' } })).to.throw(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'mm': is not a function, is: string`,
    );
  });

  it('Throws an error if formatValues is an object, but one of its properties doesn\'t return a string or number', () => {
    expect(() => buildOptions({ formatValues: { DD: () => [] } })).to.throw(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'DD': the return type for this function is not a string or number, is: array`,
    );
  });

  it('Throws an error if formatValues is an object, but several of its properties are invalid', () => {
    const formatValues = {
      formatValues: {
        mm: 'Not a valid property',
        hh: 5,
        ss: () => 5,               // These two properties
        MM: () => 'This is valid', // shouldn't be in the lest of errors.
        HH: () => [],
        DD: null,
      },
    };

    expect(() => buildOptions(formatValues)).to.throw(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'mm': is not a function, is: string\n` +
      ` 'hh': is not a function, is: number\n` +
      ` 'HH': the return type for this function is not a string or number, is: array\n` +
      ` 'DD': is not a function, is: null\n`,
    );
  });
});
