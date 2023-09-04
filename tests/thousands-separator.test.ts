import { describe, test, expect } from 'vitest';

import { ThousandsSeparator } from '../src/thousands-separator';

describe('ThousandsSeparator', () => {
  test('returns unchanged value when an int is smaller than 1000', () => {
    const result = ThousandsSeparator.format(999);
    expect(result).toEqual('999');
  });

  test('returns unchanged value when a float is smaller than 1000', () => {
    const result = ThousandsSeparator.format(999.5);
    expect(result).toEqual('999.5');
  });

  test('returns 1 000', () => {
    const result = ThousandsSeparator.format(1000);
    expect(result).toEqual('1 000');
  });

  test('returns 1 000.99', () => {
    const result = ThousandsSeparator.format(1000.99);
    expect(result).toEqual('1 000.99');
  });

  test('returns 15 000', () => {
    const result = ThousandsSeparator.format(15000);
    expect(result).toEqual('15 000');
  });

  test('returns 15 000.5', () => {
    const result = ThousandsSeparator.format(15000.5);
    expect(result).toEqual('15 000.5');
  });

  test('returns 150 000', () => {
    const result = ThousandsSeparator.format(150000);
    expect(result).toEqual('150 000');
  });

  test('returns 150 000.99', () => {
    const result = ThousandsSeparator.format(150000.99);
    expect(result).toEqual('150 000.99');
  });

  test('returns 1 500 000', () => {
    const result = ThousandsSeparator.format(1500000);
    expect(result).toEqual('1 500 000');
  });

  test('returns 1 500 000.99', () => {
    const result = ThousandsSeparator.format(1500000.99);
    expect(result).toEqual('1 500 000.99');
  });

  test('uses a different separator', () => {
    const result = ThousandsSeparator.format(150000.99, '_');
    expect(result).toEqual('150_000.99');
  });
});
