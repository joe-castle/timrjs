import { checkType } from '../src/validate'

/**
 * @description Adds a toBeType function to Jests expect object.
 * This will check if the provided string matches the type of the tested value.
 *
 * @param {any} recieved - The value that's being tested against
 * @param {String} argument - The expected value of recieved
 */
expect.extend({
  toBeType (received, argument) {
    const pass = (checkType(received) === argument)

    if (pass) {
      return {
        message: () => `expected ${checkType(received)} to not be of type ${argument}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${checkType(received)} to be of type ${argument}`,
        pass: false
      }
    }
  }
})
