module.exports = {
  wrongOptionsType: new TypeError('Warning! options needs to be an object.'),
  noTickerMethod: new Error('Warning! a Timr object requires a ticker method.'),
  wrongTickerType: new TypeError('Warning! the ticker method needs to be a function.'),
  startTime: new Error('Warning! startTime needs to be a number, 0 or above.')
};
