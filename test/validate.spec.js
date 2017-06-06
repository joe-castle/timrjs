import { expect } from 'chai';

import {
  isNum,
  isStr,
  isBool,
  isFn,
  isObj,
  checkType,
} from '../src/validate';

describe('Validate functions', () => {
  describe('isNum', () => {
    it('Returns true when a number is passed in, excluding Infinity, -Infinity or NaN.', () => {
      expect(isNum(5)).to.equal(true);
      expect(isNum(25)).to.equal(true);
      expect(isNum(41293190123)).to.equal(true);
    });

    it('Returns false when a non number is passed in, including Infinity, -Infinity or NaN.', () => {
      expect(isNum('This isn\'t a number')).to.equal(false);
      expect(isNum({})).to.equal(false);
      expect(isNum([])).to.equal(false);
      expect(isNum(() => {})).to.equal(false);
      expect(isNum(true)).to.equal(false);
      expect(isNum(false)).to.equal(false);
      expect(isNum(Infinity)).to.equal(false);
      expect(isNum(-Infinity)).to.equal(false);
      expect(isNum(NaN)).to.equal(false);
      expect(isNum(undefined)).to.equal(false);
      expect(isNum(null)).to.equal(false);
    });
  });

  describe('isStr', () => {
    it('Returns true when a string is passed in.', () => {
      expect(isStr('Hey')).to.equal(true);
      expect(isStr('Ho')).to.equal(true);
      expect(isStr('Lets go')).to.equal(true);
    });

    it('Returns false when a non string is passed in.', () => {
      expect(isStr(5)).to.equal(false);
      expect(isStr({})).to.equal(false);
      expect(isStr([])).to.equal(false);
      expect(isStr(() => {})).to.equal(false);
      expect(isStr(true)).to.equal(false);
      expect(isStr(false)).to.equal(false);
      expect(isStr(Infinity)).to.equal(false);
      expect(isStr(-Infinity)).to.equal(false);
      expect(isStr(NaN)).to.equal(false);
      expect(isStr(undefined)).to.equal(false);
      expect(isStr(null)).to.equal(false);
    });
  });

  describe('isBool', () => {
    it('Returns true when a boolean is passed in.', () => {
      expect(isBool(true)).to.equal(true);
      expect(isBool(false)).to.equal(true);
      // eslint-disable-next-line
      expect(isBool(1 === 1)).to.equal(true);
    });

    it('Returns false when a non boolean is passed in.', () => {
      expect(isBool('Not a boolean')).to.equal(false);
      expect(isBool(5)).to.equal(false);
      expect(isBool({})).to.equal(false);
      expect(isBool([])).to.equal(false);
      expect(isBool(() => {})).to.equal(false);
      expect(isBool(Infinity)).to.equal(false);
      expect(isBool(-Infinity)).to.equal(false);
      expect(isBool(NaN)).to.equal(false);
      expect(isBool(undefined)).to.equal(false);
      expect(isBool(null)).to.equal(false);
    });
  });

  describe('isFn', () => {
    it('Returns true when function is passed in.', () => {
      expect(isFn(() => {})).to.equal(true);
      // eslint-disable-next-line
      expect(isFn(function() { })).to.equal(true);
    });

    it('Returns false when a non function is passed in', () => {
      expect(isFn('This is not a function')).to.equal(false);
      expect(isFn(5)).to.equal(false);
      expect(isFn({})).to.equal(false);
      expect(isFn([])).to.equal(false);
      expect(isFn(true)).to.equal(false);
      expect(isFn(false)).to.equal(false);
      expect(isFn(Infinity)).to.equal(false);
      expect(isFn(-Infinity)).to.equal(false);
      expect(isFn(NaN)).to.equal(false);
      expect(isFn(undefined)).to.equal(false);
      expect(isFn(null)).to.equal(false);
    });
  });

  describe('isObj', () => {
    it('Returns true when an object is passed in.', () => {
      expect(isObj({})).to.equal(true);
      expect(isObj({ test: 'value' })).to.equal(true);
    });

    it('Returns false when a non object is passed in.', () => {
      expect(isObj('This is not a function')).to.equal(false);
      expect(isObj(5)).to.equal(false);
      expect(isObj(() => {})).to.equal(false);
      expect(isObj([])).to.equal(false);
      expect(isObj(true)).to.equal(false);
      expect(isObj(false)).to.equal(false);
      expect(isObj(Infinity)).to.equal(false);
      expect(isObj(-Infinity)).to.equal(false);
      expect(isObj(NaN)).to.equal(false);
      expect(isObj(undefined)).to.equal(false);
      expect(isObj(null)).to.equal(false);
    });
  });

  describe('checkType', () => {
    /* eslint-disable */
    it('Returns the correct type for the value passed in.', () => {
      expect(checkType(5)).to.equal('number');
      expect(checkType('This is a string')).to.equal('string');
      expect(checkType(() => {})).to.equal('function');
      expect(checkType(function() {})).to.equal('function');
      expect(checkType({})).to.equal('object');
      expect(checkType({ test: 'value' })).to.equal('object');
      expect(checkType([])).to.equal('array');
      expect(checkType(['test', 1])).to.equal('array');
      expect(checkType(true)).to.equal('boolean');
      expect(checkType(false)).to.equal('boolean');
      expect(checkType(1 === 1)).to.equal('boolean');
      expect(checkType(undefined)).to.equal('undefined');
      expect(checkType(null)).to.equal('null');
      expect(checkType(Infinity)).to.equal('Infinity');
      expect(checkType(-Infinity)).to.equal('-Infinity');
      expect(checkType(NaN)).to.equal('NaN');
    });
    /* eslint-disable */
  });
});
