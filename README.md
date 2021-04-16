# TimrJS

Timr is a simple utility for creating timers in JavaScript.  
It can create a simple countdown timer, a stopwatch style counter and a dynamic timer that counts down to a specific day that will be up to date no matter when you start it.

Compatible with Browsers and Node.js.

[![build status](https://img.shields.io/travis/joesmith100/timrjs.svg?style=flat-square)](https://travis-ci.org/joesmith100/timrjs)
[![coverage status](https://img.shields.io/coveralls/joesmith100/timrjs/master.svg?style=flat-square)](https://coveralls.io/github/joesmith100/timrjs?branch=master)
[![npm version](https://img.shields.io/npm/v/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm downloads](https://img.shields.io/npm/dm/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm license](https://img.shields.io/npm/l/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- ## Important
Version 1.0 has had some substantial changes made to it (some of which are breaking), if you've been using previous versions, go [here](https://github.com/joesmith100/timrjs/releases/tag/v1.0.0) to see whats changed. -->

## Examples
Here are a few different ways you could use Timr.

 - [Basic Example](http://codepen.io/joecastle/full/mOvbpy/) - A simple 10 minute timer with progress bar.
 - [Protected Values](http://codepen.io/joecastle/full/yVZBwj) - This demonstrates how the protected values work in [options.formatOutput](#options).
 - [Format Output](http://codepen.io/joecastle/full/PbVora) - A few different ways you could use the [options.formatOutput](#options) option.
 - [Christmas Countdown](http://codepen.io/joecastle/full/MbLWWq) - A full on countdown to Christmas; using a dynamic timer to keep in sync with the local time and the raw values to place into individual elements.
 - [Start Delay Examples](https://codepen.io/joecastle/pen/NWdwVVG) - A couple of examples to show how you could use `timeToSeconds` and `dateToSeconds` to create a timer that starts in the future.

## Installation
Install with npm or Bower.
```
npm install timrjs --save
```
Then import it into your project.
```ts
// ES6 imports, using a transpiler like Babel.
import { create } from 'timrjs'

// Regular old ES5
var create = require('timrjs').create
```
You can also include the following CDN:
> [https://unpkg.com/timrjs@latest/dist/timr.js](https://unpkg.com/timrjs@latest/dist/timr.js)  
> [https://unpkg.com/timrjs@latest/dist/timr.min.js](https://unpkg.com/timrjs@latest/dist/timr.min.js)

These versions will expose a single global method: `Timr`.

## Syntax
```
create(startTime[, options])
```

### Parameters

#### startTime `[type: string | number | Date | object]`

This accepts two types of syntax.

1. It takes a time. `[type: string | number]`. The following will create a simple countdown timer:
   - `'10:00'` - Creates a 10 minute timer.
   - `'01:00:00'` - Creates a 1 hour timer.
   - `600` - Equivalent to 10:00.
   - `'25m'` - Equivalent to 25:00. (minutes)
   - `'25h'` - Equivalent to 25:00:00. (hours)
   - `'25d'` - Equivalent to 600:00:00. (days)

   The provided time must follow the above patterns or an error will be thrown.

2. It takes a future date/time `[type: string | Date]`. This will create a countdown timer to that point in time. The time will be local to the user.
   - `'2021-12-25'` - Creates a countdown timer to midnight on Christmas Day.
   - `'2021-12-25 10:00'` - Creates a countdown timer to 10am on Christmas Day. 

   Internally this uses the individual date/time components of the Date constructor as described [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Individual_date_and_time_component_values) for maximum compatibility.

   You can also provide a Date object, allowing the use of custom timezones if required.
   - `new Date('2021-12-25 10:00-08:00')` - Creates a countdown timer to 10am on Christmas Day, Pacific Standard  ime.
   - `new Date('2021-12-25 10:00Z')` - Creates a countdown timer to 10am on Christmas Day, UTC Time.

   The provided date must follow the above patterns or an error will be thrown.

   If a date provided is in the past, it will also throw an error. See [options.backupStartTime](#options) for an easy solution to handle this.

Alternatively you can pass an object to `startTime` that contains a `startTime` property, allowing you to pass both startTime and options in one object.
```ts
create({
  startTime: 600,
  countdown: true,
  etc...
})
```

#### options `[type: object]`

Optional. Object which accepts: 
 - `countdown [type: boolean] [default: true] ` 
   
   This dictates whether the timer should countdown or up. If `countdown` is false and `startTime` is 0, it will act as a stopwatch. 
  
   Setting `startTime` to 0 with `countdown` as true will throw an error. 
 - `formatOutput [type: string] [default: 'DD hh:{mm:ss}']`
 
   This dictates how the formatted string will look. See [below](#formatoutput) for further explanation. Also see [examples](#examples) for different uses.
 - `formatValues [type: { [key: string]: (number) => string | number }] [default: { [key]: zeroPad }]`
   
   This dictates how each value in the formattedString is formatted. By default they are all padded with a 0. See [below](#formatvalues) for further explanation.
 - `backupStartTime [type: string | Date]`
 
   If startTime is in the past, it will attempt to use the `backupStartTime` instead. Same rules apply to this as they do to `startTime`. See [Christmas Countdown](#examples) for an example on how this might be used.

#### formatOutput
It takes the string you provide, injects the correct value in and returns that string, custom formatting included. See the [formatOutput](#examples) example for some ideas of how you can use this.

The placeholders used to make up the string are below.

```ts
// Assume today is 17th Dec 2021.
const timer = create('2021-12-25', { formatOutput: 'DD days hh:mm:ss' })

timer.formatTime()
{
  formattedTime: '07 days 00:57:58',
  raw: {
    ss: 58,
    mm: 57,
    hh: 0,
    dd: 7,
    SS: 608278,
    MM: 10137,
    HH: 168,
    DD: 7,
  },
}
```

You can use curly braces to denote 'protected values', essentially this means that the values inside the braces won't be removed as the string is formatted. See the [Protected Values](#examples) example for an idea of what this does.

If the string doesn't contain any braces, than it will be formatted as is.

**Note**: For the protected values to work correctly, Timr assumes that you write the `formatOutput` string with the placeholder values in the following order: `DDdd HHhh MMmm SSss`.

#### formatValues
Each placeholder value can be customised individually in the final formatted string.

Each entry in the `formatValues` object accepts a function that can return a number or string.
```ts
import { create, zeroPad } from 'timrjs'

const timer = create({
  startTime: '72:05:34',
  formatOutput: 'DD hh:mm:ss',
  formatValues: {
    // default applies to all placeholders that aren't customised explicitly. Defaults to the zeroPad function if not specified.
    default: (num) => `<${num}>`, 
    ss: zeroPad,
    mm: (num) => num,
    // hh: (num) => num,
    // dd: (num) => num,
    // SS: (num) => num,
    // MM: (num) => num,
    // HH: (num) => num,
    DD: (num) => num > 1 ? `${num} days` : `${num} day`,
  }
})

timer.getFt()
// 3 days <0>:5:34
```
This example is contrived but it gives you an idea of what you can do with it.

## Usage
Start by calling the Timr function with the desired startTime and any options. This will return a new Timr Object.

```ts
const timer = create('10:00');
```

### Events

Timr is event based, it's primary events are `ticker` and `finish`.

`ticker` is called every second and emits an object with the following properties:
 - `formattedTime`
 
   The current time formatted into a time string. Customised with [formatOutput](#options) and [formatValues](#options) option.
 - `raw`
 
   An object with the raw values used to calculate the current time. See [here](#formatOutput) for available properties.
 - `percentDone`
 
   The elapsed time in percent. Useful for making something like a progress bar.
 - `currentTime`
 
   The current time in seconds.
 - `startTime`
   
   The starting time in seconds.
 - `self`
   
   The original timr object.

The first call will be 1 second after the timer has started. In the below example, it will emit `'09:59'`.

To display the timers startTime initially, you can call `timer.getFt()` which will return `'10:00'` as in the case below.

If the `countdown` option has been set to false, ticker will omit `percentDone` from the provided object.

```ts
/** 
 * We can use ES6 destructuring syntax here to cherry pick the values we need.
 */
timer.ticker(({ formattedTime, percentDone }) => {
  // formattedTime: '09:59'
  // percentDone:   0
});
```

`finish` is called once, when the timer hits 0. It only emits the original timr object.

```ts
timer.finish((self) => {
  console.log('Countdown Finished!');

  // ticker: '00:00'
  // finish: 'Countdown Finished!'
});
```

Five other events are provided, all of them emit the original Timr object as the first argument and are called after their operation:
 - `onStart`
 
   If the timer has already been started and `start()` is called again, this won't emit. Instead use, `onAlreadyStarted`
 - `onAlreadyStarted`

   If the timer has started and `start()` is called again this will emit.
 - `onPause`
 - `onStop`
 - `onDestroy`
 
   This is the only event that emits **BEFORE** it carries out its operation. This is because part of that operation is to remove all event listeners from the timr.

### Controls

To control the Timr, you use the `start`, `pause` and `stop` methods.


```ts
/**
 * Start takes an optional number (in ms) argument that will
 * delay the start of the timer.
 */
timer.start([delay: number]);
timer.pause();
timer.stop();

/**
 * Because Timr is class based, to ensure the this variable is correct,
 * you'll need to bind it's functions if you want to pass them in to be called later.
 *
 * Or you can use ES6 arrow syntax which doesn't alter the this value.
 */
$('button').on('click', timer.start.bind(timer));

setTImeout(() => timer.start(), 1000);
```

### Full API
The following methods are available on all timrs. Unless they return a specific value, they return the original timer object so calls can be chained.
 - `start(delay: number): Timr`
 
   Starts the timer. Optionally delays starting by the provided ms. If a future date was used, start will update the `startTime` to ensure its in sync with the current time.
 - `pause(): Timr`
 
   Pauses the timer.
 - `stop(): Timr`
   
   Stops the timer.
 - `destroy(): Timr`
 
   Stops the timer, removes all event listeners and removes the timr from the store (if it's in one).
 - `ticker(fn: ({ formattedTime: string, raw: Raw, percentDone?: number, currentTime: number, startTime: number, self: Timr }) => void): Timr`
 
   Executes every second the timer ticks down. `percentDone` omitted if `countdown` set to false.
 - `finish(fn: (self: Timr) => void): Timr`
 
   Executes once the timer finishes.
 - `onStart(fn: (self: Timr) => void): Timr`
 
   Executes after the timer starts, unless its already started.
 - `onAlreadyStarted(fn: (self: Timr) => void): Timr`
 
   Executes if the timer has already started and `start()` is called again.
 - `onPause(fn: (self: Timr) => void): Timr`
 
   Executes after the timer is paused.
 - `onStop(fn: (self: Timr) => void): Timr`
 
   Executes after the timer is stopped.
 - `onDestroy(fn: (self: Timr) => void): Timr`
 
   Executes before the timer is destroyed.
 - `formatTime(time: 'currentTime' | 'startTime' [default='currentTime']): string`
 
   Returns an object with the `formattedTime` and `raw` values. Optionally accepts `'startTime'`, which will return the startTime formatted.
 - `percentDone(): number`
 
   Returns the time elapsed in percent.
 - `changeOptions(options): Timr`
 
   Merges the provided options into the existing ones. See: [here](#parameters) for available options.
 - `setStartTime(newStartTime[, backupStartTime]): Timr`
 
   Changes the `startTime` to the one provided. Will stop the timer if its already started. It's also subject to validation, so will throw an error if the provided time is invalid. Optionally accepts a `backupStartTime` for futureDates, will default to the one provided by options if omitted.
 - `getFt(time: 'currentTime' | 'startTime' [default='currentTime']): string`
 
   Shorthand for `formatTime(time).formattedTime`.
 - `getRaw(time: 'currentTime' | 'startTime' [default='currentTime']): Raw`
 
   Shorthand for `formatTime(time).raw`.
 - `getStartTime(): number`
 
   Returns the startTime in seconds.
 - `getCurrentTime(): number`
  
   Returns the currentTime in seconds.
 - `getStatus(statusName?: Status): Status | boolean`
   
   Returns the current status of the timer with the following available:
   - `Status.initialized` - Status representing when the Timr object is created.
   - `Status.started` - Status representing when the Timr has started.
   - `Status.paused` - Status representing when the Timr has been paused.
   - `Status.stopped` - Status representing when the Timr has stopped.
   - `Status.finished` - Status representing when the Timr has finished.
   - `Status.destroyed` - Status representing when the Timr has been destroyed.
   
   Alternatively if a `Status` argument is provided, will return a boolean confirming if the current status matches the provided one.

   `Status` is a Typescript Enum and is available as a top-level export.
   ```ts
   import { Status } from 'timrjs'
   ```

## Top Level API
### createStore
The `createStore` function provides a way to easily store multiple timrs together and perform various operations on all of them at the same time.

It is available as a top-level export.
```ts
import { createStore } from 'timrjs'

const store = createStore();
```
It also accepts Timr objects.

If any non-Timr arguments are provided, or they exist in another store, an error is thrown.

```ts
const timer1 = create('20:00');
const timer2 = create('15:00');
const timer3 = create('10:00');
const timer4 = create('5:00');

const store1 = createStore(timer1, timer2);
const store2 = createStore(timer2, timer3, timer4);
// Because timer2 already exists in store1, an error will be thrown
```

#### Store API

When createStore is called, it will return an object with the following methods:
 - `store.add(timr): Timr`
 
   Adds the provided Timr to the store. If it already exits in a store, then it won't add it. Returns the provided store.
 - `store.getAll(): Timr[]`
 
   Returns the array of all stored Timrs.
 - `store.startAll(): void`
 
   Starts all stored Timrs.
 - `store.pauseAll(): void`
 
   Pauses all stored Timrs.
 - `store.stopAll(): void`
 
   Stops all stored Timrs.
 - `store.getStatus(statusName: Status): Timr[]`

   Returns a new array of all the timrs that match the provided status.
 - `store.started(): Timr[]`
 
   Returns a new array of all stored Timrs that are running.
 - `store.removeFromStore(timr): void`
 
   Removes the provided Timr from the store.
 - `store.destroyAll(): void`
 
   Destroys all stored Timrs.

Each store is isolated, so methods run on one won't affect another.

### Utilities
The following methods are also available as top-level exports.

```ts
import {   
  formatTime,
  timeToSeconds,
  dateToSeconds,
  zeroPad
} from 'timrjs
```

 - `formatTime(seconds: number, options: Options, toBuild: boolean [default=true])`
 
   Converts seconds into a time string. Used by Timrs when outputting their formattedTime and raw values. See [here](#options) for more info.
   - `seconds` - Required. The seconds to be converted.
   - `options` - See: [options](#options)
   - `toBuild` - Mostly for internal use. Specifies whether to build the options object or not.
 - `timeToSeconds(startTime: string | number): number`

   Converts a time string into seconds. Used when passing `startTime` to `create()` so is subject to the same validity checks. Alternatively returns the argument if a positive number is passed in.

   See [Start Delay Examples](#examples) for some ideas on where you could use this.
 - `dateToSeconds(startTime: string | date, backupStartTime?: string | date): number`
   Converts a date string into seconds until that date from now. Used when passing `startTime` to `create()` so is subject to the same validity checks. Alternatively if a date object is passed it returns the seconds until that date from now.
   
   If the parsed date is in the passed, it will look for the `backUpStartTime` and try to use that instead.

   See [Start Delay Examples](#examples) for some ideas on where you could use this.
 - `zeroPad(num: number): string | number`
  
   Pads a number with a 0, for example:
   ```ts
   zeroPad(1)
   // 01
   zeroPad(11)
   // 11
   ```

### Bugs
If you find any and fancy helping me out, [create an issue](https://github.com/joesmith100/timrjs/issues), or [submit a pull request](https://github.com/joesmith100/timrjs/pulls).

### License
MIT
