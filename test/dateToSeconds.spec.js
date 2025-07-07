import dateToSeconds from '../src/dateToSeconds'

describe('Date to Seconds function', () => {
  test('When passed a date and time string, it returns seconds to that time from now.', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-05-15 14:00:00`) - Date.now()) / 1000)

    expect(dateToSeconds(`${year}-05-15 14:00:00`)).toBe(testStartTime)
  })

  test('When passed just a date string, it returns the seconds to that point in time', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000)

    expect(dateToSeconds(`${year}-12-15`)).toBe(testStartTime)
  })

  test('When passed just a date, it returns the seconds to that point in time', () => {
    const year = new Date().getFullYear() + 1
    const dateToCheck = new Date(`${year}-12-15`)
    const testStartTime = Math.ceil((dateToCheck.getTime() - Date.now()) / 1000)

    expect(dateToSeconds(dateToCheck)).toBe(testStartTime)
  })

  test('Formats backup date if provided date is in the past', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000)

    expect(dateToSeconds('2020-12-15', `${year}-12-15`)).toBe(testStartTime)
  })

  test('Returns 0 if date is in the past', () => {
    expect(dateToSeconds('2015-12-25')).toBe(0)
  })

  test('Throws an error if the passed string is incorrect format', () => {
    expect(() => dateToSeconds('not a date string')).toThrow(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional and seconds is optional if time provided.\n' +
      'You passed: "not a date string"'
    )
  })

  test('Throws an error if the passed string is correct format but an invalid date', () => {
    expect(() => dateToSeconds('0000-00-00')).toThrow(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional and seconds is optional if time provided.\n' +
      'You passed: "0000-00-00"'
    )
  })

  test('Throws an error if the passed value is not a string or date', () => {
    expect(() => dateToSeconds({})).toThrow(
      'Expected startTime to be a string or Date object, instead got: object'
    )
  })
})
