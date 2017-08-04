/**
 * @description Checks if a value is a valid number. Guards against NaN and Infinity.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNum (value) {
  return typeof value === 'number' &&
    !isNaN(value) &&
    value !== Infinity &&
    value !== -Infinity
}

/**
 * @description Checks if a value is a not a number.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNotNum (value) {
  return !isNum(value)
}

/**
 * @description Checks if a value is a string.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isStr (value) {
  return typeof value === 'string'
}

/**
 * @description Checks if a value is not a string.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNotStr (value) {
  return !isStr(value)
}

/**
 * @description Checks if a value is a boolean.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isBool (value) {
  return typeof value === 'boolean'
}

/**
 * @description Checks if a value is not a boolean.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNotBool (value) {
  return !isBool(value)
}

/**
 * @description Checks if a value is a function.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isFn (value) {
  return typeof value === 'function'
}

/**
 * @description Checks if a value is not a function.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNotFn (value) {
  return !isFn(value)
}

/**
 * @description Checks if a value is an object. Guards against null and arrays.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isObj (value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
}

/**
 * @description Checks if a value is not an object.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function isNotObj (value) {
  return !isObj(value)
}

/**
 * @description Checks if a value exists, i.e. not undefined.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function exists (value) {
  return value !== undefined
}

/**
 * @description Checks if a value doesn't exist, i.e is undefined.
 * @param value - the value to be checked
 * @return {Boolean} True if it is, false if it isn't
 */
function notExists (value) {
  return !exists(value)
}

/**
 * @description A more useful type check than typeof.
 * Guards against gotchas like null and array being an object and NaN being a number.
 * For this purpose it also explicitly states Infinity as a type rather than a number.
 *
 * @param value - The value to check the type of.
 *
 * @return {String} The type of the value.
 */
function checkType (value) {
  if (
    value === undefined ||
    value === null ||
    value === Infinity ||
    value === -Infinity
  ) {
    return `${value}`
  }

  if (isNum(value)) return 'number'
  if (isStr(value)) return 'string'
  if (isBool(value)) return 'boolean'
  if (isFn(value)) return 'function'
  if (isObj(value)) return 'object'
  if (Array.isArray(value)) return 'array'
  if (isNaN(value)) return `${NaN}`
}

export {
  isNum,
  isNotNum,
  isStr,
  isNotStr,
  isBool,
  isNotBool,
  isFn,
  isNotFn,
  isObj,
  isNotObj,
  exists,
  notExists,
  checkType
}
