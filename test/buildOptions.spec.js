import buildOptions from '../src/buildOptions'
import zeroPad from '../src/zeroPad'

describe('Build Options Function', () => {
  const timeValues = ['ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD']
  const defaultFormatValues = timeValues.reduce((obj, item) => ({
    ...obj,
    [item]: zeroPad
  }), {})

  test('Returns an object with default options.', () => {
    expect(buildOptions()).toEqual({
      formatOutput: 'DD hh:{mm:ss}',
      countdown: true,
      formatValues: defaultFormatValues,
      futureDate: false
    })
  })

  test('Returns an object with amended formatOutput option', () => {
    expect(buildOptions({ formatOutput: 'HH:MM:SS' })).toEqual(
      { formatOutput: 'HH:MM:SS', formatValues: defaultFormatValues, countdown: true, futureDate: false }
    )
    expect(buildOptions({ formatOutput: 'DD day hh:mm:ss' })).toEqual(
      { formatOutput: 'DD day hh:mm:ss', formatValues: defaultFormatValues, countdown: true, futureDate: false }
    )
  })

  test('Throws an error if formatOutput is not a string', () => {
    expect(() => buildOptions({ formatOutput: 5 })).toThrow(
      'Expected formatOutput to be a string; instead got: number'
    )
  })

  test('Returns an object with amended countdown option', () => {
    expect(buildOptions({ countdown: false })).toEqual(
      { formatOutput: 'DD hh:{mm:ss}', formatValues: defaultFormatValues, countdown: false, futureDate: false }
    )
  })

  test('Throws an error if countdown is not a boolean', () => {
    expect(() => buildOptions({ countdown: 'hey' })).toThrow(
      'Expected countdown to be a boolean; instead got: string'
    )
  })

  test('Returns an object with amended futureDate option', () => {
    expect(buildOptions({ futureDate: true })).toEqual(
      { formatOutput: 'DD hh:{mm:ss}', formatValues: defaultFormatValues, countdown: true, futureDate: true }
    )
  })

  test('Throws an error if countdown is not a boolean', () => {
    expect(() => buildOptions({ futureDate: 0 })).toThrow(
      'Expected futureDate to be a boolean; instead got: number'
    )
  })

  test('Returns an object with a function passed to formatValues', () => {
    const obj = buildOptions({ formatValues: () => 5 })

    expect(obj).toBeType('object')
    expect(obj.formatOutput).toBe('DD hh:{mm:ss}')
    expect(obj.countdown).toBe(true)

    expect(Object.keys(obj.formatValues)).toEqual(timeValues)

    Object.keys(obj.formatValues).forEach((key) => {
      const value = obj.formatValues[key]

      expect(value).toBeType('function')
      expect(value()).toBe(5)
    })
  })

  test('Returns an object with an object of functions passed to formatValues', () => {
    const obj = buildOptions({
      formatValues: {
        ss: i => i * 2,
        mm: i => `yo-${i}-yo`,
        hh: i => i
      }
    })

    expect(obj).toBeType('object')
    expect(obj.formatOutput).toBe('DD hh:{mm:ss}')
    expect(obj.countdown).toBe(true)

    expect(Object.keys(obj.formatValues)).toEqual(timeValues)

    expect(obj.formatValues.ss(2)).toBe(4)
    expect(obj.formatValues.mm(2)).toBe('yo-2-yo')
    expect(obj.formatValues.hh(2)).toBe(2)
    expect(obj.formatValues.HH(2)).toBe('02')
  })

  test('Returns an object with the formatValues changed and the correct mix of old and new options', () => {
    const oldOptions = buildOptions({
      formatValues: {
        ss: i => i,
        mm: i => i * 2
      }
    })
    const newOptions = buildOptions({
      formatValues: {
        mm: i => i * 3,
        hh: i => i * 4
      }
    }, oldOptions)

    expect(newOptions).toBeType('object')
    expect(newOptions.formatOutput).toBe('DD hh:{mm:ss}')
    expect(newOptions.countdown).toBe(true)

    expect(Object.keys(newOptions.formatValues)).toEqual(timeValues)

    expect(newOptions.formatValues.ss(2)).toBe(2)
    expect(newOptions.formatValues.mm(2)).toBe(6)
    expect(newOptions.formatValues.hh(2)).toBe(8)
    expect(newOptions.formatValues.HH(2)).toBe('02')
  })

  test('Throws an error if formatValues is neither an object nor a function', () => {
    expect(() => buildOptions({ formatValues: 'Not a function or object.' })).toThrow(
      'Expected formatValues to be a function or an object of functions; instead got: string'
    )
  })

  test('Throws an error if formatValues is a function, but it\'s return type is neither a string nor a number', () => {
    expect(() => buildOptions({ formatValues: () => null })).toThrow(
      'Expected the return value from formatValues function to be of type string or number; instead got: null'
    )
  })

  test('Throws an error if formatValues is an object, but one of it\'s keys are invalid', () => {
    expect(() => buildOptions({ formatValues: { invalidKey: 'wey' } })).toThrow(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'invalidKey': is not a recognised property, should be one of: 'ss', 'SS', 'mm', 'MM', 'hh', 'HH', 'dd', 'DD'`
    )
  })

  test('Throws an error if formatValues is an object, but one of its properties isn\'t a function', () => {
    expect(() => buildOptions({ formatValues: { mm: 'Not a function yo' } })).toThrow(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'mm': is not a function, is: string`
    )
  })

  test('Throws an error if formatValues is an object, but one of its properties doesn\'t return a string or number', () => {
    expect(() => buildOptions({ formatValues: { DD: () => [] } })).toThrow(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'DD': the return type for this function is not a string or number, is: array`
    )
  })

  test('Throws an error if formatValues is an object, but several of its properties are invalid', () => {
    const formatValues = {
      formatValues: {
        mm: 'Not a valid property',
        hh: 5,
        ss: () => 5,               // These two properties
        MM: () => 'This is valid', // shouldn't be in the lest of errors.
        HH: () => [],
        DD: null
      }
    }

    expect(() => buildOptions(formatValues)).toThrow(
      `Expected formatValues to contain a list of keys with functions that return a string or number; instead got:\n` +
      ` 'mm': is not a function, is: string\n` +
      ` 'hh': is not a function, is: number\n` +
      ` 'HH': the return type for this function is not a string or number, is: array\n` +
      ` 'DD': is not a function, is: null\n`
    )
  })
})
