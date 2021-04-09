import {
  create,
  formatTime,
  timeToSeconds,
  dateToSeconds,
  createStore,
  zeroPad
} from '../src/index'
import Timr from '../src/Timr'

const requireTimr = require('../src/index')

describe('Index function', () => {
  test('Returns a new timr object.', () => {
    expect(create('10:00')).toBeInstanceOf(Timr)
    expect(create('10m')).toBeInstanceOf(Timr)
    expect(create('10h')).toBeInstanceOf(Timr)
    expect(create(600)).toBeInstanceOf(Timr)
    expect(create(0)).toBeInstanceOf(Timr)
  })

  test('Sets up a timr object properly if a single object is passed as the startTime', (done) => {
    const timer = create({ startTime: 600 })

    expect(timer.getStartTime()).toBe(600)
    expect(timer.getCurrentTime()).toBe(600)

    timer.ticker(({ formattedTime }) => {
      expect(formattedTime).toBe('09:59')
      timer.destroy()
      done()
    }).start()
  })

  test('Throws an error if an object is passed with no / incorrect startTime value', () => {
    expect(() => create({})).toThrow(
      'When providing only an object when creating a timer, it must have a startTime property.'
    )

    expect(() => create({ startTime: 'invalid time' })).toThrow(
      'Expected time to be in (hh:mm:ss) format, instead got: invalid time'
    )

    expect(() => create({ startTime: [] })).toThrow(
      'Expected time to be a string or number, instead got: array'
    )

    expect(() => create({ startTime: -54 })).toThrow(
      'Time cannot be a negative number, got: -54'
    )
  })

  test('Exposes the top level api', () => {
    expect(zeroPad(1)).toEqual('01')
    expect(formatTime(600).formattedTime).toEqual('10:00')
    expect(timeToSeconds('10:00')).toEqual(600)
    expect(createStore(new Timr(5)).getAll()).toBeType('array')

    const year = new Date().getFullYear()
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000)
    expect(dateToSeconds(`${year}-12-25`)).toBe(time)
  })

  test('Works with require statements', () => {
    expect(requireTimr.create(600)).toBeInstanceOf(Timr)

    expect(requireTimr.zeroPad(1)).toBe('01')
    expect(requireTimr.formatTime(600).formattedTime).toBe('10:00')
    expect(requireTimr.timeToSeconds('10:00')).toBe(600)
    expect(requireTimr.createStore(new Timr(5)).getAll()).toBeType('array')

    const year = new Date().getFullYear()
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000)
    expect(requireTimr.dateToSeconds(`${year}-12-25`)).toBe(time)
  })
})
