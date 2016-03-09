'use strict';

const Timr = require('./Timr');
const timeToSeconds = require('./timeToSeconds');
const errors = require('./errors');

// module.exports =
const init = (startTime) => {
  startTime = startTime || 0;
  if (typeof startTime === 'string') {
    return new Timr(timeToSeconds(startTime));
  }
  if (typeof startTime !== 'number') {
    throw errors.startTime;
  }
  return new Timr(startTime);
};

const bob = init('10');

bob.ticker((time, seconds, startTime) => {
  console.log('Format:', time, 'Seconds:', seconds, 'Percent:', Math.floor(seconds/startTime*100))
});
bob.finish(() => console.log('Timer finished'));

bob.start();
// setTimeout(bob.pause.bind(bob), 2000);
// setTimeout(bob.start.bind(bob), 4000);
// setTimeout(bob.stop.bind(bob), 6000);
// setTimeout(bob.start.bind(bob), 8000);
