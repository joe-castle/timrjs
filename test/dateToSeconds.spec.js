import dateToSeconds from '../src/dateToSeconds'

const zeroPad = number => (number < 10 ? `0${number}` : number)

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
    const dateToCheck = Date.parse(`${year}-12-15`)
    const testStartTime = Math.ceil((dateToCheck - Date.now()) / 1000)

    expect(dateToSeconds(dateToCheck)).toBe(testStartTime)
  })

  test('When passed a unix time, it returns the seconds to that point in time', () => {
    const testTime = Date.now() + 36000
    const testStartTime = Math.ceil((testTime - Date.now()) / 1000)

    expect(dateToSeconds(testTime)).toBe(testStartTime)
  })

  test('Formats backup date if provided date is in the past', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000)

    expect(dateToSeconds('2020-12-15', `${year}-12-15`)).toBe(testStartTime)
  })

  test('Throws an error if the passed string is incorrect format', () => {
    expect(() => dateToSeconds('not a date string')).toThrow(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional as is seconds.\n' +
      'You passed: "not a date string"'
    )
  })

  test('Throws an error if the passed string is correct format but an invalid date', () => {
    expect(() => dateToSeconds('0000-00-00')).toThrow(
      'The provided date is not in the right format or is incorrect.\n' +
      'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
      '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
      'Time is optional as is seconds.\n' +
      'You passed: "0000-00-00"'
    )
  })

  test('Throws an error if the passed value is not a string, number or date', () => {
    expect(() => dateToSeconds({})).toThrow(
      'Expected startTime to be a string, number or Date object, instead got: object'
    )
  })

  test('Throws an error if the passed date is in the past and no backup time provided', () => {
    const dateNow = new Date()

    expect(() => dateToSeconds('2015-12-25')).toThrow(
      'When passing a date/time, it cannot be in the past. ' +
      'You passed: "2015-12-25". It\'s currently: "' +
      `${zeroPad(dateNow.getFullYear())}-${zeroPad(dateNow.getMonth() + 1)}-` +
      `${zeroPad(dateNow.getDate())} ` +
      `${zeroPad(dateNow.getHours())}:${zeroPad(dateNow.getMinutes())}:` +
      `${zeroPad(dateNow.getSeconds())}"`
    )
  })
})
