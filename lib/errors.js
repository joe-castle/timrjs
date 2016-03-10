module.exports = {
  startTime: new TypeError('Warning! the starting time needs to be a number (seconds) or a string representation of the time, e.g. 10:00. Will accept HH:MM:SS / MM:SS / SS.'),
  incorrectFormat: new Error('Provided time is not in the correct format. Expected HH:MM:SS / MM:SS / SS')
};
