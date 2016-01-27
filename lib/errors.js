module.exports = {
  wrongOptionsType: new TypeError('Warning! options needs to be an object.'),
  noTicketMethod: new Error('Warning! a Timr object requires an action method!'),
  wrongTickerType: new TypeError('Warning! the action method needs to be a function'),

};
