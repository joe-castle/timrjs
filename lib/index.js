'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');

const timr = (startTime) => {
  if (startTime) {
    return new Timr(timeToSeconds(startTime));
  }
  return new Timr(0);
};

const bob = timr('10:00');

bob.ticker((time) => console.log(time));
bob.finish(() => console.log('Timer finished'));

bob.start();
// setTimeout(bob.pause.bind(bob), 2000);
// setTimeout(bob.start.bind(bob), 4000);
// setTimeout(bob.stop.bind(bob), 6000);
// setTimeout(bob.start.bind(bob), 8000);
