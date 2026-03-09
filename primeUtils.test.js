const test = require('node:test');
const assert = require('node:assert/strict');

const { isPrime } = require('./primeUtils');

test('returns false for non-integers and values below 2', () => {
  assert.equal(isPrime(-5), false);
  assert.equal(isPrime(0), false);
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(2.5), false);
});

test('returns true for prime numbers', () => {
  assert.equal(isPrime(2), true);
  assert.equal(isPrime(3), true);
  assert.equal(isPrime(17), true);
  assert.equal(isPrime(97), true);
});

test('returns false for composite numbers', () => {
  assert.equal(isPrime(4), false);
  assert.equal(isPrime(9), false);
  assert.equal(isPrime(21), false);
  assert.equal(isPrime(100), false);
});
