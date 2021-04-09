import zeroPad from '../src/zeroPad'

describe('zeroPad function', () => {
  test('Returns a string 0 padded to the beginning if the number is between 0 (inclusive) and 10 (exclusive)', () => {
    expect(zeroPad(5)).toBe('05')
    expect(zeroPad(2)).toBe('02')
    expect(zeroPad(1)).toBe('01')
    expect(zeroPad(0)).toBe('00')
  })

  test('Returns the original argument if it dosen\'t satisfy the above test', () => {
    expect(zeroPad(10)).toBe(10)
    expect(zeroPad(4024)).toBe(4024)
    expect(zeroPad('Not a number yo')).toBe('Not a number yo')
  })
})
