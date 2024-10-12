import { describe, test, it , expect } from "vitest";
import { calculateAvg, factorial, fizzBuzz, max } from "../src/intro";

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2)
  })

  it('should return the second argument if it is greater', () => {
    expect(max(1, 3)).toBe(3)
  })

  it('should return the first value if both arguments are equal ', () => {
    expect(max(4, 4)).toBe(4)
  })

})


describe('fizzbuzz', () => {
  it('should return FizzBuzz if n % 3 === 0 and n % 5 === 0', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz')
  })

  it('should return Fizz if n % 3 === 0', () => {
    expect(fizzBuzz(3)).toBe('Fizz')
  })

  it('should return Buzz if n % 5 === 0', () => {
    expect(fizzBuzz(5)).toBe('Buzz')
  })

  it('should return string of n', () => {
    expect(fizzBuzz(2)).toBe('2')
  })
})

describe('calculateAvg', () => {
  it('should return Nan if given an empty array', () => {
    expect(calculateAvg([])).toBe(NaN)
  })

  it('should return first value if given an array with one value', () => {
    expect(calculateAvg([1])).toBe(1)
  })

  it('should calculate the average if given two values', () => {
    expect(calculateAvg([1, 2])).toBe(1.5)
  })
  it('should calculate the average if given three values', () => {
    expect(calculateAvg([1, 2, 3])).toBe(2)
  })
})


describe('factorial', () => {
  it('should return 1 for factorial 0', () => {
    expect(factorial(0)).toBe(1)
  })

  it('should return 1 for factorial 1', () => {
    expect(factorial(1)).toBe(1)
  })

  it('should return 6 for factorial 3', () => {
    expect(factorial(3)).toBe(6)
  })

  it('should return 24 for factorial 4', () => {
    expect(factorial(4)).toBe(24)
  })

  it('should return undefined if given a negative number', () => {
    expect(factorial(-1)).toBe(undefined)
  })
})