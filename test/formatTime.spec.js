import formatTime from '../src/formatTime'
import * as buildOptions from '../src/buildOptions'

describe('Format Time function', () => {
  const buildOptionsSpy = jest.spyOn(buildOptions, 'default')

  afterEach(() => {
    buildOptionsSpy.mockClear()
  })

  test('Returns seconds formatted into a time string.', () => {
    expect(formatTime(50).formattedTime).toBe('00:50')
    expect(formatTime(600).formattedTime).toBe('10:00')
    expect(formatTime(9600).formattedTime).toBe('02:40:00')
    expect(formatTime(96000, { formatOutput: 'DD' }).formattedTime).toBe('01')
  })

  test('Returns an object of raw values', () => {
    expect(formatTime(600).formattedTime).toBe('10:00')
    expect(formatTime(600).raw.hh).toBeType('number')
    expect(formatTime(600).raw.hh).toBe(0)
    expect(formatTime(600).raw.mm).toBe(10)
    expect(formatTime(600).raw.ss).toBe(0)
  })

  test('Returns the correct formatting with a mixture of different formatOutput strings.', () => {
    expect(formatTime(5500, { formatOutput: '00:MM:ss' }).formattedTime).toBe('00:91:40')
    expect(formatTime(5500, { formatOutput: '00-MM-ss' }).formattedTime).toBe('00-91-40')
    expect(formatTime(5500, { formatOutput: 'HH_mm_ss' }).formattedTime).toBe('01_31_40')
    expect(formatTime(5500, { formatOutput: 'SS' }).formattedTime).toBe('5500')
    expect(formatTime(5500, { formatOutput: 'HH$mm$ss' }).formattedTime).toBe('01$31$40')
    expect(formatTime(999999, { formatOutput: 'dd days hh:mm:ss' }).formattedTime)
      .toBe('11 days 13:46:39')
    expect(formatTime(999999, { formatOutput: 'dd days hh:mm:ss' }).formattedTime)
      .toBe('11 days 13:46:39')
    expect(
      formatTime(99999, { formatOutput: 'dd days hh hours mm minutes ss seconds' }).formattedTime
    ).toBe('01 days 03 hours 46 minutes 39 seconds')
  })

  test('Returns the correct formatting with a mixture of different formatOutput strings and protectedValues', () => {
    expect(formatTime(59, { formatOutput: 'DD hh:mm:ss' }).formattedTime).toBe('00 00:00:59')
    expect(formatTime(59, { formatOutput: '{DD hh:mm:ss}' }).formattedTime).toBe('00 00:00:59')
    expect(formatTime(59, { formatOutput: 'DD {hh:mm:ss}' }).formattedTime).toBe('00:00:59')
    expect(formatTime(59, { formatOutput: 'DD hh:{mm:ss}' }).formattedTime).toBe('00:59')
    expect(formatTime(59, { formatOutput: 'DD hh:mm:{ss}' }).formattedTime).toBe('59')
  })

  test('Returns the correct formatting with a mixture of different formatValues and formatOutput strings', () => {
    expect(formatTime(5500, { formatOutput: '00:MM:ss', formatValues: i => i * 2 }).formattedTime).toBe('00:182:80')
    expect(formatTime(600, { formatValues: i => `0${i}0` }).formattedTime).toBe('0100:000')
    expect(formatTime(96000, { formatValues: { DD: i => i } }).formattedTime).toBe('1 02:40:00')

    expect(formatTime(96000, {
      formatOutput: 'DD day hh hours mm minutes ss seconds',
      formatValues: {
        DD: i => `00${i}`,
        hh: i => `${i}00`,
        mm: i => i * 2,
        ss: i => i
      }
    }).formattedTime).toBe('001 day 200 hours 80 minutes 0 seconds')
  })

  test('Doesn\'t make a call to buildOptions when toBuild is set to false', () => {
    formatTime(600, buildOptions.default({ formatOutput: '00:MM:ss', formatValues: i => i * 2 }), false)

    // Called above so the options object is correct, but shouldn't be called inside formatTime
    expect(buildOptionsSpy).toBeCalledTimes(1)
  })

  test('Does make a call to buildOptions when toBuild is set to true', () => {
    formatTime(600, buildOptions.default({ formatOutput: '00:MM:ss', formatValues: i => i * 2 }), true)

    // Called above so the options object is correct
    expect(buildOptionsSpy).toBeCalledTimes(2)
  })

  test('If options doesn\'t exist, build regardless of toBuild being set to false', () => {
    formatTime(600, null, false)
    formatTime(600, undefined, false)

    expect(buildOptionsSpy).toBeCalledTimes(2)
  })

  test(`If toBuild set to false and options exist, ensure options contains formatOutput 
      and formatValues and their values are of the correct type and correct return type / expected value`, () => {
    expect(() => formatTime(600, {}, false)).not.toThrow()
  })

  test('If formatOutput contains no valid formatting options, skip formatting', () => {
    expect(() => formatTime(600, { formatOutput: 'no formatting', formatValues: (s) => s }, false)).not.toThrow()
  })
})
