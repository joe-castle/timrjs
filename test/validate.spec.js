import {
  isNum,
  isNotNum,
  isStr,
  isNotStr,
  isBool,
  isNotBool,
  isFn,
  isNotFn,
  isObj,
  isNotObj,
  checkType
} from '../src/validate'

describe('Validate functions', () => {
  describe('isNum & isNotNum', () => {
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

    test('Tests the reverse of the previous tests using isNotNum', () => {
      expect(isNotNum(5)).toBe(false)
      expect(isNotNum(25)).toBe(false)
      expect(isNotNum(41293190123)).toBe(false)

      expect(isNotNum('This isn\'t a number')).toBe(true)
      expect(isNotNum({})).toBe(true)
      expect(isNotNum([])).toBe(true)
      expect(isNotNum(() => {})).toBe(true)
      expect(isNotNum(true)).toBe(true)
      expect(isNotNum(false)).toBe(true)
      expect(isNotNum(Infinity)).toBe(true)
      expect(isNotNum(-Infinity)).toBe(true)
      expect(isNotNum(NaN)).toBe(true)
      expect(isNotNum(undefined)).toBe(true)
      expect(isNotNum(null)).toBe(true)
    })
  })

  describe('isStr & isNotStr', () => {
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

    test('Tests the reverse of the previous tests using isNotStr', () => {
      expect(isNotStr('Hey')).toBe(false)
      expect(isNotStr('Ho')).toBe(false)
      expect(isNotStr('Lets go')).toBe(false)

      expect(isNotStr(5)).toBe(true)
      expect(isNotStr({})).toBe(true)
      expect(isNotStr([])).toBe(true)
      expect(isNotStr(() => {})).toBe(true)
      expect(isNotStr(true)).toBe(true)
      expect(isNotStr(false)).toBe(true)
      expect(isNotStr(Infinity)).toBe(true)
      expect(isNotStr(-Infinity)).toBe(true)
      expect(isNotStr(NaN)).toBe(true)
      expect(isNotStr(undefined)).toBe(true)
      expect(isNotStr(null)).toBe(true)
    })
  })

  describe('isBool & isNotBool', () => {
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

    test('Tests the reverse of the previous tests using isNotBool', () => {
      expect(isNotBool(true)).toBe(false)
      expect(isNotBool(false)).toBe(false)
      // eslint-disable-next-line
      expect(isNotBool(1 === 1)).toBe(false);

      expect(isNotBool('Not a boolean')).toBe(true)
      expect(isNotBool(5)).toBe(true)
      expect(isNotBool({})).toBe(true)
      expect(isNotBool([])).toBe(true)
      expect(isNotBool(() => {})).toBe(true)
      expect(isNotBool(Infinity)).toBe(true)
      expect(isNotBool(-Infinity)).toBe(true)
      expect(isNotBool(NaN)).toBe(true)
      expect(isNotBool(undefined)).toBe(true)
      expect(isNotBool(null)).toBe(true)
    })
  })

  describe('isFn & isNotFn', () => {
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

    test('Tests the reverse of the previous tests using isNotFn', () => {
      expect(isNotFn(() => {})).toBe(false)
      // eslint-disable-next-line
      expect(isNotFn(function() { })).toBe(false);

      expect(isNotFn('This is not a function')).toBe(true)
      expect(isNotFn(5)).toBe(true)
      expect(isNotFn({})).toBe(true)
      expect(isNotFn([])).toBe(true)
      expect(isNotFn(true)).toBe(true)
      expect(isNotFn(false)).toBe(true)
      expect(isNotFn(Infinity)).toBe(true)
      expect(isNotFn(-Infinity)).toBe(true)
      expect(isNotFn(NaN)).toBe(true)
      expect(isNotFn(undefined)).toBe(true)
      expect(isNotFn(null)).toBe(true)
    })
  })

  describe('isObj & isNotObj', () => {
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

    test('Tests the reverse of the previous tests using isNotObj', () => {
      expect(isNotObj({})).toBe(false)
      expect(isNotObj({ test: 'value' })).toBe(false)

      expect(isNotObj('This is not a function')).toBe(true)
      expect(isNotObj(5)).toBe(true)
      expect(isNotObj(() => {})).toBe(true)
      expect(isNotObj([])).toBe(true)
      expect(isNotObj(true)).toBe(true)
      expect(isNotObj(false)).toBe(true)
      expect(isNotObj(Infinity)).toBe(true)
      expect(isNotObj(-Infinity)).toBe(true)
      expect(isNotObj(NaN)).toBe(true)
      expect(isNotObj(undefined)).toBe(true)
      expect(isNotObj(null)).toBe(true)
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
