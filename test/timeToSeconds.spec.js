import timeToSeconds from '../src/timeToSeconds'

describe('Time To Seconds function', () => {
  test('Returns the provided time (string) converted to seconds (number)', () => {
    expect(timeToSeconds('10:00')).toBe(600)
    expect(timeToSeconds('10:00')).toBeType('number')
    expect(timeToSeconds('50')).toBe(50)
    expect(timeToSeconds('02:40:00')).toBe(9600)
    expect(timeToSeconds('10m')).toBe(600)
    expect(timeToSeconds('10h')).toBe(36000)
  })

  test('Rounds the converted number to avoid errors with floating point values', () => {
    expect(timeToSeconds(9629.5)).toBe(9630)
    expect(timeToSeconds(329.5)).toBe(330)
  })

  test('Returns the original time if that time was a number', () => {
    expect(timeToSeconds(600)).toBe(600)
  })

  test('Throws an error if provided time is not valid', () => {
    expect(() => timeToSeconds('boom')).toThrow(
      'Expected time to be in (hh:mm:ss) format, instead got: boom'
    )
    expect(() => timeToSeconds({})).toThrow(
      'Expected time to be a string or number, instead got: object'
    )
    expect(() => timeToSeconds(() => {})).toThrow(
      'Expected time to be a string or number, instead got: function'
    )
    expect(() => timeToSeconds(-1)).toThrow(
      'Time cannot be a negative number, got: -1'
    )
    expect(() => timeToSeconds('-1')).toThrow(
      'Time cannot be a negative number, got: -1'
    )
    expect(() => timeToSeconds(NaN)).toThrow(
      'Expected time to be a string or number, instead got: NaN'
    )
    expect(() => timeToSeconds(Infinity)).toThrow(
      'Expected time to be a string or number, instead got: Infinity'
    )
    expect(() => timeToSeconds(-Infinity)).toThrow(
      'Expected time to be a string or number, instead got: -Infinity'
    )
    expect(() => timeToSeconds(null)).toThrow(
      'Expected time to be a string or number, instead got: null'
    )
  })

  test('Does not throw an error when the time is valid', () => {
    expect(() => timeToSeconds(600)).not.toThrow(Error)
    expect(() => timeToSeconds('600')).not.toThrow(Error)
    expect(() => timeToSeconds('10:00')).not.toThrow(Error)
    expect(() => timeToSeconds('10:00:00')).not.toThrow(Error)
  })
})
