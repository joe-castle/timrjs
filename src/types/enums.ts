/**
 * A Status represents the current state of a Timr object.
 */
export enum Status {
  initialized = 'initialized',
  started = 'started',
  paused = 'paused',
  stopped = 'stopped',
  finished = 'finished',
  destroyed = 'destroyed'
}
