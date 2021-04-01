/**
 * @description Checks if a value is a valid number. Guards against NaN and Infinity.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNum (value: any): value is number {
  return typeof value === 'number' &&
    !isNaN(value) &&
    value !== Infinity &&
    value !== -Infinity
}

/**
 * @description Checks if a value is a not a number.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNotNum (value: any): boolean {
  return !isNum(value)
}

/**
 * @description Checks if a value is a string.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isStr (value: any): value is string {
  return typeof value === 'string'
}

/**
 * @description Checks if a value is not a string.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNotStr (value: any): boolean {
  return !isStr(value)
}

/**
 * @description Checks if a value is a boolean.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isBool (value: any): value is boolean {
  return typeof value === 'boolean'
}

/**
 * @description Checks if a value is not a boolean.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNotBool (value: any): boolean {
  return !isBool(value)
}

/**
 * @description Checks if a value is a function.
 *
 * @param {any}  value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isFn<T> (value: any): value is T {
  return typeof value === 'function'
}

/**
 * @description Checks if a value is not a function.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNotFn<T> (value: any): boolean {
  return !isFn<T>(value)
}

/**
 * @description Checks if a value is an object. Guards against null and arrays.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isObj<T> (value: any): value is T {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
}

/**
 * @description Checks if a value is not an object.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function isNotObj<T> (value: any): boolean {
  return !isObj<T>(value)
}

/**
 * @description Checks if the provided object extends the provided class
 *
 * @param {value} value - the value to be checked
 * @param {any} clazz - the class to check against
 *
 * @returns True if it is, false if it isn't
 */
function isInstanceOf<T> (value: any, clazz: any): value is T {
  return value instanceof clazz
}

/**
 * @description Checks if the provided object does not extend the provided class
 *
 * @param {value} value - the value to be checked
 * @param {any} clazz - the class to check against
 *
 * @returns True if it is, false if it isn't
 */
function isNotOfObj<T> (value: T, clazz: any): boolean {
  return !isInstanceOf(value, clazz)
}

/**
 * @description Checks if a value exists, i.e. not undefined.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function exists (value: any): boolean {
  return value !== undefined
}

/**
 * @description Checks if a value doesn't exist, i.e is undefined.
 *
 * @param {any} value - the value to be checked
 *
 * @return {boolean} True if it is, false if it isn't
 */
function notExists (value: any): boolean {
  return !exists(value)
}

/**
 * @description A more useful type check than typeof.
 * Guards against gotchas like null and array being an object and NaN being a number.
 * For this purpose it also explicitly states Infinity as a type rather than a number.
 *
 * @param {any} value - The value to check the type of.
 *
 * @return {string|null} The type of the value.
 */
function checkType (value: any): string {
  if (
    value === undefined ||
    value === null ||
    value === Infinity ||
    value === -Infinity
  ) {
    return `${value as string}`
  }

  if (isNum(value)) return 'number'
  if (isStr(value)) return 'string'
  if (isBool(value)) return 'boolean'
  if (isFn(value)) return 'function'
  if (isObj(value)) return 'object'
  if (Array.isArray(value)) return 'array'
  if (isNaN(value)) return `${NaN}`

  return ''
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
  isInstanceOf,
  isNotOfObj,
  exists,
  notExists,
  checkType
}
