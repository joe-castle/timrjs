'use strict';

module.exports = (time) => (
  time.split(':')
    .map((item, index, arr) => {
      if (arr.length === 1) { return +item; }
      if (arr.length === 2) {
        if (index === 0) { return +item * 60; }
        return +item;
      }
      if (arr.length === 3) {
        if (index === 0) { return +item * 60 * 60; }
        if (index === 1) { return +item * 60; }
        return +item
      }
    })
    .reduce((a, b) => a+b, 0)
)
