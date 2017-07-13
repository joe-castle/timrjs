import {
  isNum,
  isStr,
  isBool,
  isFn,
  isObj,
  checkType
} from '../src/validate'

describe('Validate functions', () => {
  describe('isNum', () => {
    test('Returns true when a number is passed in, excluding Infinity, -Infinity or NaN.', () => {
      expect(isNum(5)).toBe(true)
      expect(isNum(25)).toBe(true)
      expect(isNum(41293190123)).toBe(true)
    })

    test('Returns false when a non number is passed in, including Infinity, -Infinity or NaN.', () => {
      expect(isNum('This isn\'t a number')).toBe(false)
      expect(isNum({})).toBe(false)
      expect(isNum([])).toBe(false)
      expect(isNum(() => {})).toBe(false)
      expect(isNum(true)).toBe(false)
      expect(isNum(false)).toBe(false)
      expect(isNum(Infinity)).toBe(false)
      expect(isNum(-Infinity)).toBe(false)
      expect(isNum(NaN)).toBe(false)
      expect(isNum(undefined)).toBe(false)
      expect(isNum(null)).toBe(false)
    })
  })

  describe('isStr', () => {
    test('Returns true when a string is passed in.', () => {
      expect(isStr('Hey')).toBe(true)
      expect(isStr('Ho')).toBe(true)
      expect(isStr('Lets go')).toBe(true)
    })

    test('Returns false when a non string is passed in.', () => {
      expect(isStr(5)).toBe(false)
      expect(isStr({})).toBe(false)
      expect(isStr([])).toBe(false)
      expect(isStr(() => {})).toBe(false)
      expect(isStr(true)).toBe(false)
      expect(isStr(false)).toBe(false)
      expect(isStr(Infinity)).toBe(false)
      expect(isStr(-Infinity)).toBe(false)
      expect(isStr(NaN)).toBe(false)
      expect(isStr(undefined)).toBe(false)
      expect(isStr(null)).toBe(false)
    })
  })

  describe('isBool', () => {
    test('Returns true when a boolean is passed in.', () => {
      expect(isBool(true)).toBe(true)
      expect(isBool(false)).toBe(true)
      // eslint-disable-next-line
      expect(isBool(1 === 1)).toBe(true);
    })

    test('Returns false when a non boolean is passed in.', () => {
      expect(isBool('Not a boolean')).toBe(false)
      expect(isBool(5)).toBe(false)
      expect(isBool({})).toBe(false)
      expect(isBool([])).toBe(false)
      expect(isBool(() => {})).toBe(false)
      expect(isBool(Infinity)).toBe(false)
      expect(isBool(-Infinity)).toBe(false)
      expect(isBool(NaN)).toBe(false)
      expect(isBool(undefined)).toBe(false)
      expect(isBool(null)).toBe(false)
    })
  })

  describe('isFn', () => {
    test('Returns true when function is passed in.', () => {
      expect(isFn(() => {})).toBe(true)
      // eslint-disable-next-line
      expect(isFn(function() { })).toBe(true);
    })

    test('Returns false when a non function is passed in', () => {
      expect(isFn('This is not a function')).toBe(false)
      expect(isFn(5)).toBe(false)
      expect(isFn({})).toBe(false)
      expect(isFn([])).toBe(false)
      expect(isFn(true)).toBe(false)
      expect(isFn(false)).toBe(false)
      expect(isFn(Infinity)).toBe(false)
      expect(isFn(-Infinity)).toBe(false)
      expect(isFn(NaN)).toBe(false)
      expect(isFn(undefined)).toBe(false)
      expect(isFn(null)).toBe(false)
    })
  })

  describe('isObj', () => {
    test('Returns true when an object is passed in.', () => {
      expect(isObj({})).toBe(true)
      expect(isObj({ test: 'value' })).toBe(true)
    })

    test('Returns false when a non object is passed in.', () => {
      expect(isObj('This is not a function')).toBe(false)
      expect(isObj(5)).toBe(false)
      expect(isObj(() => {})).toBe(false)
      expect(isObj([])).toBe(false)
      expect(isObj(true)).toBe(false)
      expect(isObj(false)).toBe(false)
      expect(isObj(Infinity)).toBe(false)
      expect(isObj(-Infinity)).toBe(false)
      expect(isObj(NaN)).toBe(false)
      expect(isObj(undefined)).toBe(false)
      expect(isObj(null)).toBe(false)
    })
  })

  describe('checkType', () => {
    /* eslint-disable */
    test('Returns the correct type for the value passed in.', () => {
      expect(checkType(5)).toBe('number');
      expect(checkType('This is a string')).toBe('string');
      expect(checkType(() => {})).toBe('function');
      expect(checkType(function() {})).toBe('function');
      expect(checkType({})).toBe('object');
      expect(checkType({ test: 'value' })).toBe('object');
      expect(checkType([])).toBe('array');
      expect(checkType(['test', 1])).toBe('array');
      expect(checkType(true)).toBe('boolean');
      expect(checkType(false)).toBe('boolean');
      expect(checkType(1 === 1)).toBe('boolean');
      expect(checkType(undefined)).toBe('undefined');
      expect(checkType(null)).toBe('null');
      expect(checkType(Infinity)).toBe('Infinity');
      expect(checkType(-Infinity)).toBe('-Infinity');
      expect(checkType(NaN)).toBe('NaN');
    });
    /* eslint-disable */
  });
});
