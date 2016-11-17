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
     - `'hh:mm:ss'` e.g. output: `'01:00:00'` `'00:43:23'` `'00:00:25'`.
     - `'mm:ss'` e.g. output: `'01:00:00'` - `'43:23'` - `'00:25'`.
     - `'ss'` e.g. output: `'01:00:00'` - `'43:23'` - `'25'`.
 - `formatType` - This option specifies whether to format the time string up to hours, up to minutes or just seconds. Defaults to `'h'`
    - Accepts the following values (case insensitive):
      - `'h'` e.g. output: `'02:00:00'`
      - `'m'` e.g. output: `'120:00'`
      - `'s'` e.g. output: `'7200'`
 - `separator` - This option specifies how the time string is separated. Defaults to `':'`
   - Accepts any string value, examples:
     - `'-'` e.g. output: `'10-00'`
     - `'+'` e.g. output: `'10+00'`
     - `'foobar'` e.g. output: `'10foobar00'`
 - `store` - Overrides the global store setting if provided. See: _[store](#store)_
   - Accepts `true` or `false`.

## Basic Usage
Import Timr into your project.
```js
import Timr from 'timrjs';
```
To create a Timr, simply call the function with the desired start time.
```js
const timer = Timr('10:00');
```
To `start`, `pause` and `stop`, call the desired method on the Timr.

Stopping the timer resets the time back to the startTime. Where as pause will allow you to resume the timer (with start), where it was paused from.

```js
timer.start(delay);
// Optional delay in ms before the timer starts
timer.pause();
timer.stop();
```

> _If start is called whilst the timer is already running, a warning will be logged to the console._

Each Timr emits 2 events, `ticker` and `finish`.

The `ticker` function is called every second the timer ticks down and is provided with the following arguments:
 - `formattedTime` - The current time formatted into a time string. Customisable with outputFormat, formatType and separator options.
 - `percentDone` - The elapsed time in percent.
 - `currentTime` - The current time in seconds.
 - `startTime` - The starting time in seconds.
 - `self` - The original Timr object.

> _The first time ticker is called will be 1 second after the timer starts. So if you have a 10:00 timer, the first call will emit 09:59._

```js
timer.ticker((formattedTime, percentDone, currentTime, startTime, self) => {
  console.log(formattedTime);
  // '09:59'
  console.log(percentDone);
  // 0
  console.log(currentTime);
  // 599
  console.log(startTime);
  // 600
  console.log(self);
  // Timr {_events: Object, timer: 6, running: true, options: Object…}
});
```
> _When used as a stopwatch, the ticker will be provided with 3 arguments, `formattedTime`, `currentTime` and `self`._

The `finish` method is called once, when the timer hits 0. Only 1 argument is provided into the function, the original Timr object.
```js
timer.finish(self => {
  console.log(self)
  // Timr {_events: Object, timer: 6, running: false, options: Object…}
});
```
> _When used as a stopwatch, the timer will stop and the finish function will fire when the time reaches the maximum supported time `'999:59:59'`_

All of the above methods return a reference to the timr, so calls can be chained.
### API
The following methods are available on all timrs.
 - `start(delay)` - Starts the timer. Optionally delays starting by the provided ms.
 - `pause()` - Pauses the timer.
 - `stop()` - Stops the timer.
 - `destroy()` - Stops the timer, removes all event listeners and removes the timr from the store.
 - `ticker(fn)` - The provided function executes every second the timer ticks down.
 - `finish(fn)` - The provided function executes once the timer finishes.
 - `formatTime(time)` - Returns the currentTime, formatted. Optionally accepts 'startTime', which will return the startTime formatted.
 - `percentDone()` - Returns the time elapsed in percent.
 - `changeOptions(options)` - Merges the provided options into the existing ones. See: _[options](#parameters)_ for available options. The store option does nothing after a timr is created. See: _[store](#store)_ for adding / removing a timr.
 - `setStartTime(newStartTime)` - Changes the startTime to the one provided and returns it formatted. Will stop the timer if its running. It's also subject to validation, so will throw an error if the provided time is invalid.
 - `getStartTime()` - Returns the startTime in seconds.
 - `getCurrentTime()` - Returns the currentTime in seconds.
 - `isRunning()` - Returns true if the timer is running, false otherwise.

```js
timer.start();
// Returns a reference to the timr.
timer.pause();
// Returns a reference to the timr.
timer.stop();
// Returns a reference to the timr.
timer.destroy();
// Returns a reference to the timr.
timer.ticker(ft => console.log(ft));
// Returns a reference to the timr.
timer.finish(() => console.log('All done!'));
// Returns a reference to the timr.
timer.formatTime();
// '10:00'
timer.formatTime('startTime');
// '10:00'
timer.percentDone();
// 0
timer.changeOptions({ separator: '-' });
// Returns a reference to the timr.
timer.setStartTime('11:00');
// '11:00'
timer.getStartTime();
// 600
timer.getCurrentTime();
// 600
timer.isRunning();
// false
```
## Top Level API
### Store
The store is a singleton object that stores all Timr objects created, providing some useful methods that can be run on all Timrs at once.

By default this feature is disabled, to enable, set the store variable to true after importing Timr.
```js
import Timr from 'timrjs';

Timr.store = true;
```
Each Timr can override this setting on creation by setting the store option:
```js
const timer = Timr('10:00', { store: false });
// This Timr won't be stored, regardless of the global setting.
```
**Available Methods**
 - `Timr.add(timr)` - Adds the provided Timr to the store. If it already exits  in the store, then it won't add it again. Returns the provided Timr.
 - `Timr.getAll()` - Returns the array of all stored Timrs.
 - `Timr.startAll()` - Starts all stored Timrs.
 - `Timr.pauseAll()` - Pauses all stored Timrs.
 - `Timr.stopAll()` - Stops all stored Timrs.
 - `Timr.isRunning()` - Returns a new array of all stored Timrs that are running.
 - `Timr.removeFromStore(timr)` - Removes the provided Timr from the store.
 - `Timr.destroyAll()` - Destroys all stored Timrs.

### Utilities
The following methods are availble on the imported Timr object.
 - `Timr.validate(startTime)` - Validates the startTime and returns it converted into seconds.
   - Ensures provided time is a number or a string.
   - Ensures it is not a negative number.
   - Checks validity of time string.
   - Ensures provided time does not exceed '999:59:59'.
 - `Timr.formatTime(seconds, separator, outputFormat, formatType)` - Converts seconds into a time string. Used by Timrs when outputting their formattedTime.
   - `seconds` - Required. The seconds to be converted.
   - `separator` `outputFormat` `formatType` - See: _[parameters > options](#parameters)_
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
Timr.formatTime(600, '-');
// '10-00'
Timr.formatTime(600, undefined, 'HH:MM:SS');
// '00:10:00'
Timr.formatTime(7200, undefined, undefined, 'm');
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
