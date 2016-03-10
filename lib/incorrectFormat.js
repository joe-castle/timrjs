'use strict';

module.exports = (time) => {
  time = time.split(':');
  if (
    time.length === 3 && (
      (+time[0] < 0 || +time[0] > 23 || isNaN(+time[0])) ||
      (+time[1] < 0 || +time[1] > 59 || isNaN(+time[1])) ||
      (+time[2] < 0 || +time[2] > 59 || isNaN(+time[2]))
    )
  ) { return true; }
  if (
    time.length === 2 && (
      (+time[0] < 0 || +time[0] > 59 || isNaN(+time[0])) ||
      (+time[1] < 0 || +time[1] > 59 || isNaN(+time[1]))
    )
  ) { return true; }
  if (
    time.length === 1 && (
      (+time[0] < 0 || +time[1] > 59 || isNaN(+time[0]))
    )
  ) { return true; }

  return false;
}
