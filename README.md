# TimrJS

Timr is a simple utility for creating timers in JavaScript.  
It can create a simple countdown timer, a stopwatch style counter and a dynamic timer that counts down to a specific day that will be up to date no matter when you start it.

Compatible with Browsers and Node.js.  
Additionally, the compiled versions support RequireJS.

[![build status](https://img.shields.io/travis/joesmith100/timrjs.svg?style=flat-square)](https://travis-ci.org/joesmith100/timrjs)
[![coverage status](https://img.shields.io/coveralls/joesmith100/timrjs/master.svg?style=flat-square)](https://coveralls.io/github/joesmith100/timrjs?branch=master)
[![npm version](https://img.shields.io/npm/v/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm downloads](https://img.shields.io/npm/dm/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)
[![npm license](https://img.shields.io/npm/l/timrjs.svg?style=flat-square)](https://www.npmjs.com/package/timrjs)

## Important
Version 1.0 has had some substantial changes made to it (some of which are breaking), if you've been using previous versions, go [here](https://github.com/joesmith100/timrjs/releases/tag/v1.0.0) to see whats changed.

## Examples
Here are a few different ways you could use Timr.

 - [Basic Example](http://codepen.io/joesmith/full/mOvbpy/) - A simple 10 minute timer with progress bar.
 - [Protected Values](http://codepen.io/joesmith/full/yVZBwj) - This demonstrates how the protected values work in [formatOutput](#options).
 - [Format Output](http://codepen.io/joesmith/full/PbVora) - A few different ways you could use the [formatOutput](#options) option.
 - [Christmas Countdown](http://codepen.io/joesmith/full/MbLWWq) - A full on countdown to Christmas; using a dynamic timer to keep in sync with the local time and the raw values to place into individual elements.

## Installation
Install with npm or Bower.
```
npm install timrjs --save
```
Then import it into your project.
```js
// ES6 imports, using a transpiler like Babel.
import Timr from 'timrjs';

// Regular old ES5
var Timr = require('timrjs');
```
You can also include the following CDN:
> [https://cdn.jsdelivr.net/timrjs/latest/timr.js](https://cdn.jsdelivr.net/timrjs/latest/timr.js)  
> [https://cdn.jsdelivr.net/timrjs/latest/timr.min.js](https://cdn.jsdelivr.net/timrjs/latest/timr.min.js)

The compiled versions will expose a single global method: `Timr`.  
Alternatively, they will define a module if you are using RequireJS: `require(['Timr'])`.

## Syntax
```
Timr(startTime[, options]);
```

### Parameters

#### startTime

This accepts two types of syntax, both of which take a string or a number.

Firstly, it takes a time. The following will create a simple countdown timer:
 - `'10:00'` - Creates a 10 minute timer.
 - `'01:00:00'` - Creates a 1 hour timer.
 - `600` - Equivalent to 10:00.
 - `'25m'` - Equivalent to 25:00.
 - `'25h'` - Equivalent to 25:00:00.

The provided time must follow the above patterns or an error will be thrown.

Secondly, it takes a future date/time. This will create a countdown timer to that point in time. Unless specifically stated, the time will be local to the user.
 - `'2016-12-25'` - Creates a countdown timer to midnight on Christmas Day, local time.
 - `'2016-12-25T10:00'` - Creates a countdown timer to 10am on Christmas Day, local time.
 - `'2016-12-25T10:00-08:00'` - Creates a countdown timer to 10am on Christmas Day, Pacific Standard Time.
 - `'2016-12-25T10:00Z'` - Creates a countdown timer to 10am on Christmas Day, UTC Time.

This uses the browsers built-in `Date.parse()` function, most browsers support this, however, you may want to check compatibility [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Browser_compatibility). 

If you want to ensure it works on all browsers, you can pass in a unix time stamp (in ms). To distinguish between a normal timer and a unix time stamp, Timr will assume any time provided that is over 2 years (63072000000 ms) is a unix time.
 - `1482688800000` - This is equivalent to: `'2016-12-25T10:00-08:00'`.

The provided date must follow the above patterns or an error will be thrown.  

If a date provided is in the past, it will also throw an error.

#### options

Optional. Object which accepts:
 - `padRaw: [default=true]` - This dictates whether the raw values returned from formatTime are padded with a zero or not. If true, they return a padded string, if false a number.
 - `countdown: [default=true]` - This dictates whether the timer should countdown or up. If the provided startTime is falsy, this will be set to false and the timer will act like a stopwatch. 
 - `formatOutput: [default='DD hh:{mm:ss}']` - This dictates how the formatted string will look. See below for further explanation. Also see [examples](#examples) for different uses.

#### formatOutput
It takes the string you provide, injects the correct value in and returns that string, custom formatting included. See the [formatOutput](#examples) example for some ideas of how you can use this.

The placeholders used to make up the string are below.

```js
// Assume today is 17th Dec 2016.
const timer = Timr('2016-12-25', { formatOutput: 'DD days hh:mm:ss' });

timer.formatTime();
{
  formattedTime: '7 days 00:57:58',
  raw: {
    totalDays: '07', // DD
    totalHours: '00', // HH
    totalMinutes: '57', // MM
    totalSeconds: '58', // SS
    currentDays: '07', // dd
    currentHours: '168', // hh
    currentMinutes: '10137', // mm
    currentSeconds: '608278', // ss
  },
}
```

You can use curly braces to denote 'protected values', essentially this means that the values inside the braces won't be removed as the string is formatted. See the [Protected Values](#examples) example for an idea of what this does.

If the string doesn't contain any braces, than it will be formatted as is.

Note: For the protected values to work correctly, Timr assumes that you write the `formatOutput` string with the placeholder values in the following order: `DDdd HHhh MMmm SSss`.

## Usage
Start by calling the Timr function with the desired startTime and any options. This will return a new Timr Object.

```js
const timer = Timr('10:00');
```

### Events

Timr is event based, it's primary events are `ticker` and `finish`.

`ticker` is called every second and emits an object with the following properties:
 - `formattedTime` - The current time formatted into a time string. Customised with [formatOutput](#options) option.
 - `raw` - An object with the raw values used to calculate the current time. See [here](#formatOutput) for available properties.
 - `percentDone` - The elapsed time in percent. Useful for making something like a progress bar.
 - `currentTime` - The current time in seconds.
 - `startTime` - The starting time in seconds.
 - `self` - The original timr object.

The first call will be 1 second after the timer has started. In the below example, it will emit `'09:59'`.

To display the timers startTime initially, you can call `timer.getFt()` which will return `'10:00'` as in the case below.

If the `countdown` option has been set to false, ticker will omit `percentDone` from the provided object.

```js
/** 
 * We can use ES6 destructuring syntax here to cherry pick the values we need.
 */
timer.ticker(({ formattedTime, percentDone }) => {
  // formattedTime: '09:59'
  // percentDone:   0
});
```

`finish` is called once, when the timer hits 0. It only emits the original timr object.

```js
timer.finish((self) => {
  console.log('Countdown Finished!');

  // ticker: '00:00'
  // finish: 'Countdown Finished!'
});
```

Four other events are provided, all of them emit the original timr object as the first argument and are called after their operation:
 - `onStart` - If the timer has already been started and `start()` is called again, this won't emit.
 - `onPause`
 - `onStop`
 - `onDestroy` - This is the only event that emits **BEFORE** it carries out its operation. This is because part of that operation is to remove all event listeners from the timr.

### Controls

To control the Timr, you use the `start`, `pause` and `stop` methods.

```js
/**
 * Start takes an optional number (in ms) argument that will
 * delay the start of the timer.
 */
timer.start([delay]);
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
 - `start(delay)` - Starts the timer. Optionally delays starting by the provided ms. If a date was provided, start will update the startTime to ensure its in sync with the current time.
 - `pause()` - Pauses the timer.
 - `stop()` - Stops the timer.
 - `destroy()` - Stops the timer, removes all event listeners and removes the timr from the store (if it's in one).
 - `ticker(fn)` - Executes every second the timer ticks down.
 - `finish(fn)` - Executes once the timer finishes.
 - `onStart(fn)` - Executes after the timer starts, unless its already running.
 - `onPause(fn)` - Executes after the timer is paused.
 - `onStop(fn)` - Executes after the timer is stopped.
 - `onDestroy(fn)` - Executes before the timer is destroyed.
 - `formatTime(time)` - Returns an object with the formattedTime and raw values. Optionally accepts 'startTime', which will return the startTime formatted.
 - `percentDone()` - Returns the time elapsed in percent.
 - `changeOptions(options)` - Merges the provided options into the existing ones. See: [here](#parameters) for available options.
 - `setStartTime(newStartTime)` - Changes the startTime to the one provided and returns it formatted. Will stop the timer if its running. It's also subject to validation, so will throw an error if the provided time is invalid.
 - `getFt(time)` - Shorthand for formatTime().formattedTime.
 - `getRaw(time)` - Shorthand for getRaw().formattedTime.
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

#### Store API

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
 - `Timr.validateStartTime(startTime)` - Validates the startTime and returns it converted into seconds.
   - Ensures provided time is a number or a string.
   - Ensures it is not a negative number.
   - Checks validity of time string.
 - `Timr.formatTime(seconds, options)` - Converts seconds into a time string. Used by Timrs when outputting their formattedTime and raw values. See [here](#options) for more info.
   - `seconds` - Required. The seconds to be converted.
   - `options` - See: [parameters > options](#parameters)
 - `Timr.timeToSeconds(time)` - Converts a time string into seconds. Must be separated by a colon, e.g. '10:00'. Used in the validate method.

### Bugs
This is my first contribution to the Open Source community so I fully expect there to be bugs.

If you find any and fancy helping me out, [create an issue](https://github.com/joesmith100/timrjs/issues), or [submit a pull request](https://github.com/joesmith100/timrjs/pulls).
### License
MIT
