import { it, expect, describe } from 'vitest';
import {
  Money,
  MoneyMultiplicationFactor,
  MoneyDivisionFactor,
} from '../src/money';
import { RoundUp, RoundDown } from '../src/rounding';

const roundUp = new RoundUp();
const roundDown = new RoundDown();

describe('Money', () => {
  it('creates an empty instance', () => {
    const money = new Money();
    expect(money.getAmount()).toEqual(0);
  });

  it('creates an instance with a value', () => {
    const money = new Money(100);
    expect(money.getAmount()).toEqual(100);
  });

  it('throws an error when passing a float value', () => {
    expect(() => new Money(100.5)).toThrow();
  });

  it('add()', () => {
    const money1 = new Money(100);
    const money2 = new Money();

    expect(money1.add(money2).getAmount()).toEqual(100);
  });

  it('multiply() - integer', () => {
    const money = new Money(100);
    const factor = MoneyMultiplicationFactor.parse(5);

    expect(money.multiply(factor).getAmount()).toEqual(500);
  });

  it('multiply() - float', () => {
    const money = new Money(100);
    const factor = MoneyMultiplicationFactor.parse(1.5);

    expect(money.multiply(factor).getAmount()).toEqual(150);
  });

  it('subtract() - result more than zero', () => {
    const money1 = new Money(100);
    const money2 = new Money(20);

    expect(money1.subtract(money2).getAmount()).toEqual(80);
  });

  it('subtract() - result zero', () => {
    const money1 = new Money(100);
    const money2 = new Money(100);

    expect(money1.subtract(money2).getAmount()).toEqual(0);
  });

  it('subtract() - result less than zero', () => {
    const money1 = new Money(100);
    const money2 = new Money(120);

    expect(() => money1.subtract(money2).getAmount()).toThrow('Less than zero');
  });

  it('multiply() - float - with default round-to-nearest rounding', () => {
    const money = new Money(99);
    const factor = MoneyMultiplicationFactor.parse(1.5);

    expect(money.multiply(factor).getAmount()).toEqual(149);
  });

  it('multiply() - float - with round-up rounding', () => {
    const money = new Money(99, roundUp);
    const factor = MoneyMultiplicationFactor.parse(1.5);

    expect(money.multiply(factor).getAmount()).toEqual(149);
  });

  it('multiply() - float - with round-down rounding', () => {
    const money = new Money(99, roundDown);
    const factor = MoneyMultiplicationFactor.parse(1.5);

    expect(money.multiply(factor).getAmount()).toEqual(148);
  });

  it('divide() - int', () => {
    const money = new Money(99);
    const factor = MoneyDivisionFactor.parse(1.5);

    expect(money.divide(factor).getAmount()).toEqual(66);
  });

  it('divide() - float - with default round-to-nearest rounding', () => {
    const money = new Money(99);
    const factor = MoneyDivisionFactor.parse(2);

    expect(money.divide(factor).getAmount()).toEqual(50);
  });

  it('divide() - float - with round-up rounding', () => {
    const money = new Money(99, roundUp);
    const factor = MoneyDivisionFactor.parse(2);

    expect(money.divide(factor).getAmount()).toEqual(50);
  });

  it('divide() - float - with round-down rounding', () => {
    const money = new Money(99, roundDown);
    const factor = MoneyDivisionFactor.parse(2);

    expect(money.divide(factor).getAmount()).toEqual(49);
  });

  it('equals()', () => {
    const oneHundred = new Money(100);
    const twoHundred = new Money(200);

    expect(oneHundred.equals(oneHundred)).toEqual(true);
    expect(oneHundred.equals(twoHundred)).toEqual(false);
  });

  it('equals()', () => {
    const oneHundred = new Money(100);
    const twoHundred = new Money(200);

    expect(oneHundred.equals(oneHundred)).toEqual(true);
    expect(oneHundred.equals(twoHundred)).toEqual(false);
  });

  it('isGreaterThan()', () => {
    const oneHundred = new Money(100);
    const twoHundred = new Money(200);

    expect(oneHundred.isGreaterThan(oneHundred)).toEqual(false);
    expect(twoHundred.isGreaterThan(oneHundred)).toEqual(true);
  });

  it('isLessThan()', () => {
    const oneHundred = new Money(100);
    const twoHundred = new Money(200);

    expect(oneHundred.isLessThan(oneHundred)).toEqual(false);
    expect(oneHundred.isLessThan(twoHundred)).toEqual(true);
  });

  it('isZero()', () => {
    const money = new Money();

    expect(money.isZero()).toEqual(true);
  });

  it('format()', () => {
    const cases: [number, string][] = [
      [9999, '99.99'], // Standard case
      [90, '0.90'], // Less than a dollar, two decimal places
      [99, '0.99'], // Less than a dollar, two decimal places
      [10209, '102.09'], // More than a dollar, two decimal places
      [0, '0.00'], // Zero value
      [1, '0.01'], // One cent
      [100, '1.00'], // One dollar, no cents
      [1000, '10.00'], // Ten dollars, no cents
      [123456789, '1234567.89'], // Large value with cents
    ];

    for (const [value, string] of cases) {
      expect(new Money(value).format()).toEqual(string);
    }
  });
});
