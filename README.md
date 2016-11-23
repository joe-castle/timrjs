# TimrJS

Timr is a simple, event driven utility for creating timers in JavaScript.

Compatible with Browsers and Node.js.

Additionally, the compiled versions support RequireJS.

[![build status](https://img.shields.io/travis/joesmith100/timrjs.svg?style=flat-square)](https://travis-ci.org/joesmith100/timrjs)
[![coverage status](https://img.shields.io/coveralls/joesmith100/timrjs/master.svg?style=flat-square)](https://coveralls.io/github/joesmith100/timrjs?branch=master)
[![npm version](https://img.shields.io/npm/v/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm downloads](https://img.shields.io/npm/dm/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm license](https://img.shields.io/npm/l/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)

## Installation
Install with npm or Bower.
```
npm install timrjs --save
```

Alternatively you can include the following CDN:
> https://cdn.jsdelivr.net/timrjs/latest/timr.js

> https://cdn.jsdelivr.net/timrjs/latest/timr.min.js

Or include `node_modules/dist/timr.min.js` on your page with a standalone `<script>` tag.

Both of these will expose a single global method `Timr`. Alternatively, they will define a module if you are using RequireJS `require(['Timr'])`.

## Syntax
```
Timr(startTime[, options]]);
```

### Parameters
**startTime**

Accepts a string or a number; a number is treated as seconds. Examples of accepted syntax:
 - `'10:00'` - Time units must be separated by a colon.
 - `600` - Equivalent to 10:00.
 - `'50'` - 50 seconds.
 - `'25m'` - Equivalent to 25:00. Can be 25M.
 - `'25h'` - Equivalent to 25:00:00. Can be 25H.
 - `0` - Sets up a stopwatch style counter, counting up rather than down.

If the provided startTime is invalid an error will be thrown. Times up to 999:59:59 are supported.

**options**

Optional. Object which accepts:
 - `outputFormat` - This option specifies how many 00 should be added to the front of the time string as it counts down from hours to minutes to seconds. Defaults to `'mm:ss'`
   - Accepts the following values (case insensitive):
     - `'hh:mm:ss'` e.g. output: `'02:00:00'` `'00:20:00'` `'00:00:20'`.
     - `'mm:ss'` e.g. output: `'02:00:00'` - `'20:00'` - `'00:20'`.
     - `'ss'` e.g. output: `'02:00:00'` - `'20:00'` - `'20'`.
 - `formatType` - This option specifies whether to format the time string up to hours, up to minutes or just seconds. Defaults to `'h'`
    - Accepts the following values (case insensitive):
      - `'h'` e.g. output: `'02:00:00'`
      - `'m'` e.g. output: `'120:00'`
      - `'s'` e.g. output: `'7200'`
 - `separator` - This option specifies how the time string is separated. Defaults to `':'`
   - Accepts any string value, examples:
     - `':'` e.g. output: `'20:00'`
     - `'-'` e.g. output: `'20-00'`
     - `'+'` e.g. output: `'20+00'`

## Basic Usage
Import Timr into your project.
```js
import Timr from 'timrjs';
```
Start by calling the Timr function with the desired startTime and any options. This will return a new Timr Object.
```js
const timer = Timr('10:00');
```
Each Timr emits 2 events, `ticker` and `finish`.

The `ticker` function is called every second the timer ticks down and is provided with the following arguments:
 - `formattedTime` - The current time formatted into a time string. Customisable with outputFormat, formatType and separator options.
 - `percentDone` - The elapsed time in percent. _Useful for making something like a progress bar._
 - `currentTime` - The current time in seconds.
 - `startTime` - The starting time in seconds.
 - `self` - The original Timr object.

```js
/**
 * Tickers first call will be 1 second after the timer has started.
 * In our current example, the first call will emit '09:59'.
 *
 * To display the timers startTime before starting the timer, you can call
 * timer.formatTime() which will return, in this case, '10:00'.
 */
timer.ticker((formattedTime, percentDone, currentTime, startTime) => {
  // formattedTime: '09:59'
  // percentDone:   0
  // currentTime:   599
  // startTime:     600
});

/**
 * If the Timr has been setup as a stopwatch, ticker will only be provided
 * with 3 arguments: formattedTime, currentTime and self
 */
```

The `finish` method is called once, when the timer hits 0. Only 1 argument is provided into the function, the original Timr object.
```js
timer.finish(() => {
  // ticker: '00:00'
  // finish: 'Countdown Finished!'
})

/*
 * If the Timr has been setup as a stopwatch, the timer will stop
 * and the finish function will fire when the time reaches the
 * maximum supported time of '999:59:59'.
 */
 Timr(0).finish(() => {
   // ticker: '1000:00:00'
   // finish: 'Stopwatch Finished!''
 });
```

To control the Timr, you use the `start`, `pause` and `stop` methods.

```js
/*
 * Start takes an optional number (in ms) argument that will
 * delay the start of the timer.
 */
timer.start([delay]);
timer.pause();
timer.stop();
```

All of the methods discussed thus for return a reference to the original Timr so calls can be chained. The same goes for the rest of the methods below, unless they specifically return a value, like: `timer.formatTime()`

### API
The following methods are available on all timrs.
 - `start(delay)` - Starts the timer. Optionally delays starting by the provided ms.
 - `pause()` - Pauses the timer.
 - `stop()` - Stops the timer.
 - `destroy()` - Stops the timer, removes all event listeners and removes the timr from the store (if it's in one).
 - `ticker(fn)` - The provided function executes every second the timer ticks down.
 - `finish(fn)` - The provided function executes once the timer finishes.
 - `formatTime(time)` - Returns the currentTime, formatted. Optionally accepts 'startTime', which will return the startTime formatted.
 - `percentDone()` - Returns the time elapsed in percent.
 - `changeOptions(options)` - Merges the provided options into the existing ones. See: _[options](#parameters)_ for available options. The store option does nothing after a timr is created. See: _[store](#store)_ for adding / removing a timr.
 - `setStartTime(newStartTime)` - Changes the startTime to the one provided and returns it formatted. Will stop the timer if its running. It's also subject to validation, so will throw an error if the provided time is invalid.
 - `getStartTime()` - Returns the startTime in seconds.
 - `getCurrentTime()` - Returns the currentTime in seconds.
 - `isRunning()` - Returns true if the timer is running, false otherwise.

## Top Level API
### createStore
The createStore function provides a way to easily store multiple timrs together and perform various operations on all of them at the same time.

It is available on the imported Timr Object.
```js
const store = Timr.createStore();
```

It also accepts Timr objects; these can be as separate arguments or together in an Array.

If any non-Timr arguments are provided, they will be removed from the array. If a Timr object also exists in another store, they won't be added to a new one.


```js
const timer1 = Timr('20:00');
const timer2 = Timr('15:00');
const timer3 = Timr('10:00');
const timer4 = Timr('5:00');

const store1 = Timr.createStore(timer1, timer2);
const store2 = Timr.createStore([timer2, timer3, timer4]);
// Because timer2 already exists in store1, it won't be added to store2.
```

**API**

When createStore is called, it will return an object with the following methods:
 - `Timr.add(timr)` - Adds the provided Timr to the store. If it already exits in a store, then it won't add it. Returns the provided Timr.
 - `Timr.getAll()` - Returns the array of all stored Timrs.
 - `Timr.startAll()` - Starts all stored Timrs.
 - `Timr.pauseAll()` - Pauses all stored Timrs.
 - `Timr.stopAll()` - Stops all stored Timrs.
 - `Timr.isRunning()` - Returns a new array of all stored Timrs that are running.
 - `Timr.removeFromStore(timr)` - Removes the provided Timr from the store.
 - `Timr.destroyAll()` - Destroys all stored Timrs.

Each store is isolated, so methods run on one won't affect another.

### Utilities
The following methods are also available on the imported Timr object.
 - `Timr.validate(startTime)` - Validates the startTime and returns it converted into seconds.
   - Ensures provided time is a number or a string.
   - Ensures it is not a negative number.
   - Checks validity of time string.
   - Ensures provided time does not exceed '999:59:59'.
 - `Timr.formatTime(seconds, options)` - Converts seconds into a time string. Used by Timrs when outputting their formattedTime.
   - `seconds` - Required. The seconds to be converted.
   - `options` - See: _[parameters > options](#parameters)_
 - `Timr.timeToSeconds(time)` - Converts a time string into seconds. Must be separated by a colon, e.g. '10:00'. Used in the validate method.
 - `Timr.correctFormat(time)` - Checks the format of a time string. Must be separated by a colon, e.g. '10:00'. Used in the validate method.

```js
Timr.validate('10:00');
// 600
Timr.validate(600);
// 600
Timr.validate('invalid input');
// Throws an error
Timr.validate('25:00:00');
// Throws an error

Timr.formatTime(600);
// '10:00'
Timr.formatTime(600, { separator: '-' });
// '10-00'
Timr.formatTime(600, { outputFormat: 'HH:MM:SS' });
// '00:10:00'
Timr.formatTime(7200, { formatType: 'm' });
// '120:00'

Timr.timeToSeconds('10:00');
// 600
Timr.timeToSeconds('1:34:23');
// 5663

Timr.correctFormat('10:00');
// true
Timr.correctFormat('25:00:00');
// true
Timr.correctFormat('invalid');
// false
Timr.correctFormat('14:-5:28');
// false
```
### Bugs
This is my first contribution to the Open Source community so I fully expect there to be bugs.

If you find any and fancy helping me out, go _**[here](https://github.com/joesmith100/timrjs/issues)**_ to create an issue, or send one of those fancy pull requests.
### License
MIT
