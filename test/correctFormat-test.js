const expect = require('chai').expect;

const correctFormat = require('../src/utils/correctFormat');

describe('Correct Format function', () => {
  it('Returns true if the provided time is in the correct format', () => {
    expect(correctFormat('10:00')).to.equal(true);
    expect(correctFormat('07:10:00')).to.equal(true);
    expect(correctFormat('09')).to.equal(true);
    expect(correctFormat('999:00:00')).to.equal(true);
    expect(correctFormat('10:80')).to.equal(true);
    expect(correctFormat('1000:10:00')).to.equal(true);
  });

  it('Returns false if the provided time is not the correct format', () => {
    expect(correctFormat('10-00')).to.equal(false);
    expect(correctFormat('10:10:10:00')).to.equal(false);
    expect(correctFormat('10:-10')).to.equal(false);
    expect(correctFormat('boom:10')).to.equal(false);
    expect(correctFormat({})).to.equal(false);
  });
});
