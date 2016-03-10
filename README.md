# Timr
Timr is a simple utility for creating timers in JavaScript.

Timr makes use of some ES6 features, so if your project needs to support environments that don't have ES6 support, it's recommended to use a transplier like babel.

Otherwise it works with most modern browsers and the latest versions of Node.
### Installation
```
npm install timr --save
```
### Usage
```js
import Timr from 'timr';

const timer = Timr('10:00');

/**
 * The ticker function is the main way to interact with the timer.
 *
 * Every second this will be called and will be provided with:
 * currentTime (Formatted to - HH:MM:SS).
 * currentSeconds (The time in seconds)
 * startTime (The initial starting time in seconds)
 */

timer.ticker((currentTime, currentSeconds, startTime) => {
  console.log(currentTime)
  // '09:59'
  console.log(seconds)
  // 599
  console.log(startTime)
  // 600
});

/**
 * The finish method is called only once when the timer finishes.
 * No arguments are provided into the function.
 */

timer.finish(() => {
  console.log('timer finished');
  // timer finished
});
```
Because Timr inherits from EventEmitter, you can declare as many unique ticker/finish methods as you want.
```js
/**
 * To start the timer, simply call .start() on the newly
 * created Timr object.
 */

timer.start();

// pause() and stop() are also available.

timer.pause();
timer.stop();

/**
 * You can get the value of the currentTime at any point by
 * simply calling .getCurrentTime() on the Timr object.
 * This will return the time in seconds.
 *
 * If you want the time to be formatted, you can call .formatTime().
 */

timer.getCurrentTime();
// 600
timer.formatTime();
// '10:00'

/**
 * Timr also keeps track of whether the timer is running or not.
 * You can check this by calling .isRunning().
 * It will return true if the timer is running and false if not.
 */

timer.isRunning();
// false

/**
 * Finally, methods (except formatTime, isRunning and
 * getCurrentTime) return this, so you can chain some
 * methods together.
 */

timer.start().isRunning();
// true
```
That's all there is to it! As simple as you get.
### Bugs
This is my first contribution to the Open Source community and really my first proper project so I fully expect there to be bugs.

If you find any and fancy helping me out, send one of those fancy Pull Requests and I'll do my best to merge it into the project.
### Future Plans
I have some ideas to improve Timr.
 - Option to customise time format separator, e.g. HH-MM-SS.
 - Additionally, to be able to specify the output:
   - HH:MM:SS - 01:00:00 or 00:43:23 or 00:00:25.
   - MM:SS    - 01:00:00 or 43:23    or 00:25.
   - SS       - 01:00:00 or 43:23    or 25.
 - To provide an optional 100 millisecond counter: 01:40:20:24.
 - Create a single file for browser scripts.
 - Refactor, I suspect some of my code is quite verbose.

### License
MIT
