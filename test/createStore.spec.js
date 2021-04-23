import createStore from '../src/createStore'
import Timr from '../src/Timr'
import { Status } from '../src/types/enums'

describe('Create Store Function', () => {
  test('Creates a new empty store.', () => {
    const store = createStore()

    expect(store.getAll()).toHaveLength(0)
  })

  test('Creates a new store with the provided arguments', () => {
    const timer = new Timr(0)
    const store1 = createStore(new Timr(0), timer)

    expect(store1.getAll()).toHaveLength(2)

    store1.getAll().forEach((item) => {
      expect(item).toBeInstanceOf(Timr)
    })
  })

  test('Creates new store and provides timr objects with a removeFromStore function', () => {
    const store = createStore(new Timr(0), new Timr(0), new Timr(0))

    store.getAll().forEach((timr) => {
      expect(timr.removeFromStore).toBeType('function')
    })
  })

  test('Adds the timr to the store and returns the timr', () => {
    const store = createStore()
    const timer = new Timr(600)

    expect(store.add(timer)).toBe(timer)
    expect(store.getAll()[0]).toBe(timer)
  })

  test('Throws an error if the timr is already in a store', () => {
    const store1 = createStore()
    const store2 = createStore()
    const timer = new Timr(600)

    store1.add(timer)

    expect(() => store1.add(timer)).toThrow(
      'Unable to add to store; provided argument is either already in a store or not a timr object.'
    )

    expect(() => store2.add(timer)).toThrow(
      'Unable to add to store; provided argument is either already in a store or not a timr object.'
    )
  })

  test('Throws an error if the provided argument is not a timr object', () => {
    const store = createStore()

    expect(() => store.add('not a timr object')).toThrow(
      'Unable to add to store; provided argument is either already in a store or not a timr object.'
    )
    expect(store.add).toThrow(
      'Unable to add to store; provided argument is either already in a store or not a timr object.'
    )
  })

  test('Throws an error if the provided argument is either in a store or not a Timr object when the store is created', () => {
    expect(() => createStore('not a timer', 1, new Timr(50))).toThrow(
      'Unable to add to store; provided argument is either already in a store ' +
      'or not a timr object.'
    )
  })

  test('Starts all the timers.', (done) => {
    const timer = new Timr(600)
      .ticker(({ formattedTime }) => {
        expect(formattedTime).toBe('09:59')
        timer.stop()
        done()
      })

    const store = createStore(timer)
    store.startAll()
  })

  test('Pauses all the timers.', (done) => {
    const store = createStore()
    const timer = new Timr(600)
      .ticker(() => {
        expect(timer.started()).toBe(true)
        store.pauseAll()
        expect(timer.started()).toBe(false)
        done()
      })

    store.add(timer)
    store.startAll()
  })

  test('Stops all the timers.', (done) => {
    const store = createStore()
    const timer = new Timr(600)
      .ticker(({ formattedTime }) => {
        expect(formattedTime).toBe('09:59')
        store.stopAll()
        expect(timer.getCurrentTime()).toBe(600)
        done()
      })

    store.add(timer)
    store.startAll()
  })

  test('Returns an array of all timrs that match a status.', () => {
    const timer1 = new Timr(600)
    timer1.start().pause()
    const timer2 = new Timr(600)
    timer2.start().pause()
    const timer3 = new Timr(600)
    const timer4 = new Timr(600)
    const store = createStore(timer1, timer2, timer3, timer4)

    expect(store.getStatus(Status.paused)).toHaveLength(2)
  })

  test('Returns an array of all the timrs that have started.', () => {
    const timer = new Timr(600)
    const store = createStore(timer)

    expect(store.started()).toHaveLength(0)
    store.startAll()
    expect(store.started()).toHaveLength(1)
    store.stopAll()
  })

  test('Returns an array of all the timrs that have started using deprecated isRunning.', () => {
    const timer = new Timr(600)
    const store = createStore(timer)

    expect(store.isRunning()).toHaveLength(0)
    store.startAll()
    expect(store.isRunning()).toHaveLength(1)
    store.stopAll()
  })

  test('Removes provided Timr from the store.', () => {
    const timer = new Timr(600)
    const store = createStore(timer)

    expect(store.getAll()).toHaveLength(1)

    store.removeFromStore(timer)

    expect(store.getAll()).toHaveLength(0)
    expect(timer.removeFromStore).toBeNull()
  })

  test('A timr is able to remove itself from the a store.', () => {
    const timer1 = new Timr(5)
    const timer2 = new Timr(5)
    const timer3 = new Timr(5)

    const store = createStore(timer1, timer2, timer3)

    expect(store.getAll()).toHaveLength(3)

    timer1.destroy()

    expect(timer1.removeFromStore).toBeNull()
    expect(store.getAll()).toHaveLength(2)
    expect(store.getAll().includes(timer1)).toBe(false)
  })

  test('Destroys all timers.', () => {
    const timer1 = new Timr(600)
    const timer2 = new Timr(600)
    const store = createStore(timer1, timer2)

    expect(store.getAll()).toHaveLength(2)

    store.destroyAll()

    expect(store.getAll()).toHaveLength(0)

    expect(timer1.removeFromStore).toBeNull()
    expect(timer2.removeFromStore).toBeNull()
  })
})
