import { expect } from 'chai'

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
  it('Returns a new timr object.', () => {
    expect(create('10:00')).to.be.an.instanceof(Timr)
    expect(create('10m')).to.be.an.instanceof(Timr)
    expect(create('10h')).to.be.an.instanceof(Timr)
    expect(create(600)).to.be.an.instanceof(Timr)
    expect(create(0)).to.be.an.instanceof(Timr)
  })

  it('Sets up a timr object properly if a single object is passed as the startTime', (done) => {
    const timer = create({ startTime: 600 })

    expect(timer.getStartTime()).to.equal(600)
    expect(timer.getCurrentTime()).to.equal(600)

    timer.ticker(({ formattedTime }) => {
      expect(formattedTime).to.equal('09:59')
      timer.destroy()
      done()
    }).start()
  })

  it('Throws an error if an object is passed with no / incorrect startTime value', () => {
    expect(() => create({})).to.throw(
      'When providing only an object when creating a timer, it must have a startTime property.'
    )

    expect(() => create({ startTime: 'invalid time' })).to.throw(
      'Expected time to be in (hh:mm:ss) format, instead got: invalid time'
    )

    expect(() => create({ startTime: [] })).to.throw(
      'Expected time to be a string or number, instead got: array'
    )

    expect(() => create({ startTime: -54 })).to.throw(
      'Time cannot be a negative number, got: -54'
    )
  })

  it('Exposes the top level api', () => {
    expect(zeroPad(1)).to.equal('01')
    expect(formatTime(600).formattedTime).to.equal('10:00')
    expect(timeToSeconds('10:00')).to.equal(600)
    expect(createStore(new Timr(5)).getAll()).to.be.an('array')

    const year = new Date().getFullYear()
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000)
    expect(dateToSeconds(`${year}-12-25`)).to.equal(time)
  })

  it('Works with require statements', () => {
    expect(requireTimr.create(600)).to.an.instanceOf(Timr)

    expect(requireTimr.zeroPad(1)).to.equal('01')
    expect(requireTimr.formatTime(600).formattedTime).to.equal('10:00')
    expect(requireTimr.timeToSeconds('10:00')).to.equal(600)
    expect(requireTimr.createStore(new Timr(5)).getAll()).to.be.an('array')

    const year = new Date().getFullYear()
    const time = Math.ceil((Date.parse(`${year}-12-25`) - Date.now()) / 1000)
    expect(requireTimr.dateToSeconds(`${year}-12-25`)).to.equal(time)
  })
})
