import { expect } from 'chai';

import zeroPad from '../src/zeroPad';

describe.only('zeroPad function', () => {
  it('Returns a string 0 padded to the beginning if the number is between 0 (inclusive) and 10 (exclusive)', () => {
    expect(zeroPad(5)).to.equal('05');
    expect(zeroPad(2)).to.equal('02');
    expect(zeroPad(1)).to.equal('01');
    expect(zeroPad(0)).to.equal('00');
  });

  it('Returns the original argument if it dosen\'t satisfy the above test', () => {
    expect(zeroPad(10)).to.equal(10);
    expect(zeroPad(4024)).to.equal(4024);
    expect(zeroPad('Not a number yo')).to.equal('Not a number yo');
  });
});
