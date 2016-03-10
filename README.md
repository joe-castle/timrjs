# Timr
---
Timr is a simple utility for creating timers in JavaScript.

Timr makes use of some ES6 features, so if your project needs to support environments that don't have ES6 support, it's recommended to use a transplier like babel.

Otherwise it works with most modern browsers and the latest versions of Node.
### Installation
```
npm install timr --save
```
### Usage
```
import Timr from 'timr';

const timer = Timr('10:00');

timer.start();
timer.pause();
timer.stop();

// Called every second the timer ticks down.
timer.ticker((currentTime, seconds, startTime) => {
  console.log(currentTime)
  // '10:00'
  console.log(seconds)
  // 600
  console.log(startTime)
  // 600
});

// Called once when the timer finishes.
timer.finish(() => {
  // timer finished
});
```
Because Timr inherits from EventEmitter, you can declare as many ticker/finish methods as you want.

### License
MIT
