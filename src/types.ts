import Timr from './Timr'

/**
 * Options
 */
export interface OptionalOptions {
  formatOutput?: string
  countdown?: boolean
  formatValues?: OptionsFormatValues | FormatValueFn
  futureDate?: boolean | number
  startTime?: string | number
  backupStartTime?: string | number
}

export interface Options {
  formatOutput: string
  countdown: boolean
  formatValues: OptionsFormatValues
  futureDate: boolean | number
  startTime?: string | number
  backupStartTime?: string | number
}

export interface OptionsFormatValues {
  ss?: FormatValueFn
  SS?: FormatValueFn
  mm?: FormatValueFn
  MM?: FormatValueFn
  hh?: FormatValueFn
  HH?: FormatValueFn
  dd?: FormatValueFn
  DD?: FormatValueFn
  [key: string]: FormatValueFn | undefined
}

export type FormatValueFn = (value: number) => string | number

/**
 * Store
 */
export interface Store {
  add: (timr: Timr) => Timr
  getAll: () => Timr[]
  startAll: () => void
  pauseAll: () => void
  stopAll: () => void
  getStatus: () => Timr[]
  isRunning: () => Timr[]
  removeFromStore: (timr: Timr) => void
  destroyAll: () => void
}

/**
 * EventEmitter
 */
export interface Events {
  [key: string]: Listener[]
}

export type Listener = (...args: any[]) => void

/**
 * FomartTime Output
 */
export interface FormattedTime {
  formattedTime: string
  raw: Raw
}

export interface Raw {
  SS: number
  MM: number
  HH: number
  DD: number
  ss: number
  mm: number
  hh: number
  dd: number
  [key: string]: number
}

/**
 * Timr
 */
export enum Status {
  initialized = 'initialized',
  started = 'started',
  paused = 'paused',
  stopped = 'stopped',
  destroyed = 'destroyed'
}