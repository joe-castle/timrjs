import dateToSeconds from '../src/dateToSeconds'

const zeroPad = number => (number < 10 ? `0${number}` : number)

describe('Date to Seconds function', () => {
  test('When passed a date and time, it returns seconds to that time from now.', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-05-15 14:00:00`) - Date.now()) / 1000)

    expect(dateToSeconds(`${year}-05-15 14:00:00`)).toBe(testStartTime)
  })

  test('When passed just a date, it returns the seconds to that point in time', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000)

    expect(dateToSeconds(`${year}-12-15`)).toBe(testStartTime)
  })

  test('When passed a unix time, it returns the seconds to that point in time', () => {
    const testTime = Date.now() + 36000
    const testStartTime = Math.ceil((testTime - Date.now()) / 1000)

    expect(dateToSeconds(testTime)).toBe(testStartTime)
  })

  // test('When passing a timezone offset, it returns the seconds to that point in time.', () => {
  //   const year = new Date().getFullYear() + 1
  //   const testStartTime1 = Math.ceil((Date.parse(`${year}-12-25T10:00:00-05:00`) - Date.now()) / 1000)
  //   const testStartTime2 = Math.ceil((Date.parse(`${year}-12-25T10:00:00+05:00`) - Date.now()) / 1000)
  //   const testStartTime3 = Math.ceil((Date.parse(`${year}-12-25T10:00:00Z`) - Date.now()) / 1000)

  //   expect(dateToSeconds(`${year}-12-25T10:00:00-05:00`)).toBe(testStartTime1)
  //   expect(dateToSeconds(`${year}-12-25T10:00:00+05:00`)).toBe(testStartTime2)
  //   expect(dateToSeconds(`${year}-12-25T10:00:00Z`)).toBe(testStartTime3)
  // })

  // test('Throws an error if the value passed does not match the date/time pattern.', () => {
  //   expect(() => dateToSeconds('howdo')).toThrow(
  //     'The provided date is not in the right format or is incorrect.\n' +
  //     'Expected a string in the format: YYYY-MM-DD[ HH:MM[:SS]].\n' +
  //     '(year)-(month)-(day) (hour):(minute):(second(s))\n' +
  //     'Time is optional as is seconds.\n' +
  //     `You passed: "howdo"`
  //   )
  // })

  // test('Throws an error if the format matches the regex but an error occured, like mixing up the month and day', () => {
  //   const year = new Date().getFullYear() + 1

  //   expect(() => dateToSeconds(`${year}-13-25`)).toThrow(
  //     'Something went wrong parsing the date. Did you mix up the month and day?\n' +
  //     'Format should follow: YYYY-MM-DDTHH:MM:SS-01:00. Note: Time, seconds and timezone are optional.\n' +
  //     `You passed: "${year}-13-25".`
  //   )
  // })

  test('Formats backup date if provided date is in the past', () => {
    const year = new Date().getFullYear() + 1
    const testStartTime = Math.ceil((Date.parse(`${year}-12-15`) - Date.now()) / 1000)

    expect(dateToSeconds('2020-12-15', `${year}-12-15`)).toBe(testStartTime)
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
