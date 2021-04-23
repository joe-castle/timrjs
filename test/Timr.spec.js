import Timr from '../src/Timr'
import createStore from '../src/createStore'
import * as buildOptions from '../src/buildOptions'
import * as dateToSeconds from '../src/dateToSeconds'
import * as timeToSeconds from '../src/timeToSeconds'
import { Status } from '../src/types/enums'

describe('Timr Class', () => {
  const dateToSecondsSpy = jest.spyOn(dateToSeconds, 'default')
  const timeToSecondsSpy = jest.spyOn(timeToSeconds, 'default')

  afterEach(() => {
    dateToSecondsSpy.mockClear()
    timeToSecondsSpy.mockClear()
  })

  describe('Timr instantiation', () => {
    test('Creates a new Timr object', () => {
      expect(new Timr(600).startTime).toBe(600)
      expect(new Timr(600).currentTime).toBe(600)
      expect(new Timr(0).currentTime).toBe(0)
    })

    test('Calls dateToSeconds if startTime passed with date-time string', () => {
      const timer = new Timr(`${(new Date()).getFullYear()}-12-31`)

      expect(timer.startTime).toBeTruthy()
      expect(dateToSecondsSpy).toBeCalledTimes(1)
    })

    test('Calls timetoSeconds if startTime passed with time string', () => {
      const timer = new Timr('10:00')

      expect(timer.startTime).toBeTruthy()
      expect(timeToSecondsSpy).toBeCalledTimes(1)
    })

    test('Status is set to initialised when Timr created', () => {
      const timer = new Timr(600)

      expect(timer.getStatus(Status.initialized)).toBeTruthy()
    })

    test('Throws an error if startTime is not a string or a number', () => {
      expect(() => new Timr({})).toThrow(
        'Expected time to be a string or number, instead got: object'
      )
    })
  })

  describe('start method', () => {
    test('Starts the timer', (done) => {
      const timer = new Timr(600).start()
        .ticker(({ formattedTime }) => {
          expect(formattedTime).toBe('09:59')
          timer.stop()
          done()
        })
    })

    test('Starts the timer after a delay', (done) => {
      const startTime = Date.now()
      const timer = new Timr(600).start(1000)
        .ticker(() => {
          expect(Date.now() - startTime >= 2000)
          timer.stop()
          done()
        })
    })

    test('If a date has been used to start the timer, start will re-run setStartTime ' +
    'to ensure the startTime is in sync. Allowing .start() ' +
    'to be called at a later time.', (done) => {
      const year = new Date().getFullYear() + 1

      const timer = new Timr(`${year}-12-15 10:00:00`)
        .ticker(({ currentTime }) => {
          const testStart = Math.ceil((Date.parse(`${year}-12-15T10:00:00`) - Date.now()) / 1000)

          expect(currentTime).toBe(testStart)

          timer.destroy()
          done()
        })

      setTimeout(() => timer.start(), 2000)
    })

    test('Same test as above, but using starts delay feature', (done) => {
      const year = new Date().getFullYear() + 1

      const timer = new Timr(`${year}-12-15 10:00:00`)
        .ticker(({ currentTime }) => {
          const testStart = Math.ceil((Date.parse(`${year}-12-15T10:00:00`) - Date.now()) / 1000)

          expect(currentTime).toBe(testStart)

          timer.destroy()
          done()
        })
        .start(2000)
    })

    test('Emits the onStart event', (done) => {
      const timer = new Timr(600)
        .onStart((self) => {
          expect(self).toBe(timer)
          timer.destroy()
          done()
        })

      timer.start()
    })

    test('Status is set to started when .start() called', () => {
      const timer = new Timr(600)
        .start()

      expect(timer.getStatus(Status.started)).toBeTruthy()
    })

    test('Emits onAlreadyStarted when start() called when timer has already started', (done) => {
      const timer = new Timr(600)
        .onAlreadyStarted((self) => {
          expect(self).toBe(timer)
          timer.destroy()
          done()
        })

      timer.start()
      timer.start()
    })

    test('Throws an error if start is called with countdown set to true and startTime set to 0', () => {
      expect(() => new Timr(0).start()).toThrow(
        'Unable to start timer when countdown = true and startTime = 0. ' +
        'This would cause the timer to count into negative numbers and never stop. ' +
        'Try setting countdown to false or amending the startTime'
      )
    })

    test('Throws an error if start is called with a delay argument that isn\'t a number', () => {
      expect(() => new Timr(500).start([])).toThrow(
        'The delay argument passed to start must be a number, you passed: array'
      )

      expect(() => new Timr(500).start({})).toThrow(
        'The delay argument passed to start must be a number, you passed: object'
      )

      expect(() => new Timr(500).start(NaN)).toThrow(
        'The delay argument passed to start must be a number, you passed: NaN'
      )
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.start()
      expect(returnVal).toBe(timer)
      timer.destroy()
    })
  })

  describe('pause method', () => {
    test('Pauses the timer', (done) => {
      const timer = new Timr(600)
        .ticker(() => {
          expect(timer.started()).toBe(true)
          timer.pause()
          expect(timer.started()).toBe(false)
          done()
        })
        .start()
    })

    test('Emits the onPause event', (done) => {
      const timer = new Timr(600)
        .onPause((self) => {
          expect(self).toBe(timer)
          timer.destroy()
          done()
        })

      timer.start()
      timer.pause()
    })

    test('Status is set to paused when .pause() called', () => {
      const timer = new Timr(600)
        .start()
        .pause()

      expect(timer.getStatus(Status.paused)).toBeTruthy()
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.pause()
      expect(returnVal).toBe(timer)
    })
  })

  describe('stop method', () => {
    test('Stops the timer', (done) => {
      const timer = new Timr(600)
        .ticker(({ formattedTime }) => {
          expect(formattedTime).toBe('09:59')
          timer.stop()
          expect(timer.getCurrentTime()).toBe(600)
          done()
        })
        .start()
    })

    test('Emits the onStop event', (done) => {
      const timer = new Timr(600)
        .onStop((self) => {
          expect(self).toBe(timer)
          timer.destroy()
          done()
        })

      timer.start()
      timer.stop()
    })

    test('Status is set to started when .stop() called', () => {
      const timer = new Timr(600)
        .start()
        .stop()

      expect(timer.getStatus(Status.stopped)).toBeTruthy()
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.stop()
      expect(returnVal).toBe(timer)
    })
  })

  describe('destroy method', () => {
    test('Clears the timer and removes all event listeners', () => {
      const timer = new Timr(600)
      timer.ticker(() => {})
      timer.ticker(() => {})
      timer.finish(() => {})

      expect(timer.events.ticker).toHaveLength(2)
      expect(timer.events.finish).toHaveLength(1)

      timer.destroy()

      expect(timer.events.ticker).toBeUndefined()
      expect(timer.events.finish).toBeUndefined()
    })

    test('Removes the timer from the store', () => {
      const timer = new Timr(600)
      const store = createStore(timer)

      expect(store.getAll()).toContain(timer)

      timer.destroy()

      expect(store.getAll()).not.toContain(timer)
      expect(timer.removeFromStore).toBeNull()
    })

    test('Emits the onDestroy event', (done) => {
      const timer = new Timr(600)
        .onDestroy((self) => {
          expect(self).toBe(timer)
          done()
        })

      timer.destroy()
    })

    test('Status is set to destroyed when .destroy() called', () => {
      const timer = new Timr(600)
        .start()
        .destroy()

      expect(timer.getStatus(Status.destroyed)).toBeTruthy()
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.destroy()
      expect(returnVal).toBe(timer)
    })
  })

  describe('ticker method', () => {
    test('Fires the ticker function every second the timer runs, ' +
      'returning the formattedTime, precentDone, currentTime, ' +
      'startTime and the original Timr object.', (done) => {
      const timer = new Timr(600)
        .ticker(({ formattedTime, percentDone, currentTime, startTime, self }) => {
          expect(formattedTime).toBe('09:59')
          expect(percentDone).toBe(0)
          expect(currentTime).toBe(599)
          expect(startTime).toBe(600)
          expect(self).toBe(timer)
          timer.stop()
          done()
        })
        .start()
    })

    test('As a stopwatch, fires the ticker function every second the timer runs, ' +
      'returning the formattedTime, startTime, currentTime and original Timr object.', (done) => {
      const timer = new Timr(0, { countdown: false })
        .ticker(({ formattedTime, currentTime, startTime, self }) => {
          expect(formattedTime).toBe('00:01')
          expect(currentTime).toBe(1)
          expect(startTime).toBe(0)
          expect(self).toBe(timer)
          timer.stop()
          done()
        })
        .start()
    })

    test('The stopwatch is able to be started at any given time; previously in ' +
     'pre v1.0.0 a stopwatch could only be started at 0.', (done) => {
      const timer = new Timr(600, { countdown: false })
        .ticker(({ formattedTime, currentTime, startTime, self }) => {
          expect(formattedTime).toBe('10:01')
          expect(currentTime).toBe(601)
          expect(startTime).toBe(600)
          expect(self).toBe(timer)
          timer.stop()
          done()
        })
        .start()
    })

    test('Throws an error if the ticker method is called with no ' +
      'function provided as the first argument', () => {
      expect(() => new Timr(600).ticker()).toThrow(
        'Expected ticker to be a function, instead got: undefined'
      )
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.ticker(() => {})
      expect(returnVal).toBe(timer)
    })
  })

  describe('finish method', () => {
    test('Fires the finish function when the timer finishes ' +
      'and provides the original Timr object.', (done) => {
      const timer = new Timr(1).start()
      timer.finish((self) => {
        expect(self).toBe(timer)

        setTimeout(() => {
          expect(self.getStatus()).toBe(Status.finished)
          done()
        })
      })
    })

    test('Throws an error if the finish method is called with no ' +
      'function provided as the first argument', () => {
      expect(() => new Timr(600).finish()).toThrow(
        'Expected finish to be a function, instead got: undefined'
      )
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.finish(() => {})
      expect(returnVal).toBe(timer)
    })
  })

  describe('formatTime method', () => {
    test('Returns the currentTime formatted into a time string', () => {
      expect(new Timr(50).formatTime().formattedTime).toBe('00:50')
      expect(new Timr(600).formatTime().formattedTime).toBe('10:00')
      expect(new Timr(9600).formatTime().formattedTime).toBe('02:40:00')
    })

    test('Returns the currentTime formatted into a time string with a modified formatOutput', () => {
      expect(new Timr(600, { formatOutput: 'MM-SS' }).formatTime().formattedTime)
        .toBe('10-600')
      expect(new Timr(600, { formatOutput: 'boop' }).formatTime().formattedTime)
        .toBe('boop')
    })

    test('Returns the startTime formatted into a time string', () => {
      expect(new Timr(50).formatTime('startTime').formattedTime).toBe('00:50')
      expect(new Timr(600).formatTime('startTime').formattedTime).toBe('10:00')
      expect(new Timr(9600).formatTime('startTime').formattedTime).toBe('02:40:00')
    })

    test('Returns the startTime formatted into a time string with a modified formatOutput', () => {
      expect(new Timr(600, { formatOutput: '00:mm:ss' }).formatTime('startTime').formattedTime)
        .toBe('00:10:00')
      expect(new Timr(50, { formatOutput: 'SS' }).formatTime('startTime').formattedTime)
        .toBe('50')
    })

    test('Doesn\'t call buildOptions when calling formatTime', (done) => {
      const buildOptionsSpy = jest.spyOn(buildOptions, 'default')

      new Timr(60).ticker(({ currentTime, self }) => {
        if (currentTime <= 58) {
          // Called once when Timr created
          expect(buildOptionsSpy).toBeCalledTimes(1)
          self.stop()
          done()
        }
      }).start()
    })
  })

  describe('percentDone method', () => {
    test('Returns the time elapsed in percent', () => {
      const timer = new Timr(600)
      expect(timer.percentDone()).toBe(0)
      timer.currentTime = 400
      expect(timer.percentDone()).toBe(33)
    })
  })

  describe('changeOptions methods', () => {
    test('Changes the timrs options after creation.', () => {
      const timer = new Timr(600)
      expect(timer.formatTime().formattedTime).toBe('10:00')
      timer.changeOptions({ formatOutput: '00-mm-ss' })
      expect(timer.formatTime().formattedTime).toBe('00-10-00')
    })

    test('Changes the timrs options after creation and merges with existing ones.', () => {
      const timer = new Timr(600)
      expect(timer.formatTime().formattedTime).toBe('10:00')
      expect(timer.formatTime().raw.mm).toBe(10)
      timer.changeOptions({ formatOutput: '00-mm-ss' })
      expect(timer.formatTime().formattedTime).toBe('00-10-00')
      expect(timer.formatTime().raw.mm).toBe(10)
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.changeOptions()
      expect(returnVal).toBe(timer)
      timer.destroy()
    })
  })

  describe('setStartTime method', () => {
    test('Changes the startTime after Timr created', () => {
      const timer = new Timr(600)
      expect(timer.startTime).toBe(600)
      timer.setStartTime(800)
      expect(timer.startTime).toBe(800)
      timer.setStartTime('10m')
      expect(timer.startTime).toBe(600)
    })

    test('Clears the existing timer and sets the ' +
      'currentTime and startTime to the new starTime', (done) => {
      const timer = new Timr(600).start()
      timer.ticker(({ currentTime }) => {
        expect(currentTime).toBe(599)
        timer.setStartTime('11:00')
        expect(timer.getStartTime()).toBe(660)
        expect(timer.getCurrentTime()).toBe(660)
        done()
      })
    })

    test('Throws an error if the newly provided startTime is invalid', () => {
      const timer = new Timr(600)

      expect(() => timer.setStartTime('12-12')).toThrow(Error)
      expect(() => timer.setStartTime({})).toThrow(Error)
      expect(() => timer.setStartTime('invalid')).toThrow(Error)
    })

    test('Throws an error if no startTime value is passed', () => {
      expect(() => new Timr(600).setStartTime()).toThrow(
        'You must provide a startTime value'
      )
    })

    test('Returns a reference to the Timr', () => {
      const timer = new Timr(600)
      const returnVal = timer.setStartTime(0)
      expect(returnVal).toBe(timer)
      timer.destroy()
    })
  })

  describe('getFt', () => {
    test('Returns the formattedTime.', () => {
      expect(new Timr(600).getFt()).toBe('10:00')
    })
  })

  describe('getRaw', () => {
    test('Returns the raw values.', () => {
      expect(new Timr(600).getRaw()).toEqual({
        DD: 0,
        HH: 0,
        MM: 10,
        SS: 600,
        dd: 0,
        hh: 0,
        mm: 10,
        ss: 0
      })
    })
  })

  describe('getStartTime method', () => {
    test('Returns the currentTime in seconds', () => {
      expect(new Timr(600).getStartTime()).toBe(600)
    })
  })

  describe('getCurrentTime method', () => {
    test('Returns the currentTime in seconds', () => {
      expect(new Timr(600).getCurrentTime()).toBe(600)
    })
  })

  describe('started method', () => {
    test('Returns false when the timer isnt running', () => {
      expect(new Timr(600).started()).toBe(false)
    })

    test('Returns true when the timer is running', () => {
      const timer = new Timr(600).start()
      expect(timer.started()).toBe(true)
      timer.stop()
    })
  })
})
