import { it, expect, describe } from 'vitest';

import { MinMaxScaler } from '../src/min-max-scaler';

describe('MinMaxScaler', () => {
  describe('scale', () => {
    it('should scale a value within the configured range', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);

      const original = 50;
      const scaled = 15;

      const result = scaler.scale(original);

      expect(result).eql({ original, scaled, isMin: false, isMax: false });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: false,
        isUpperBound: false,
        original,
        scaled,
      });
    });

    it('should scale a value within the configured range up to 2 decimal places', () => {
      const config = { min: 0, max: 27, bound: { lower: 0, upper: 9 } };
      const scaler = new MinMaxScaler(config);

      const original = 5;
      const scaled = 1.67;

      const result = scaler.scale(original);

      expect(result).eql({ scaled, original, isMin: false, isMax: false });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: false,
        isUpperBound: false,
        original: 5.01,
        scaled,
      });
    });

    it('should scale a value with default range', () => {
      const config = { min: 0, max: 100 };
      const scaler = new MinMaxScaler(config);

      const original = 50;
      const scaled = 0.5;

      const result = scaler.scale(original);

      expect(result).eql({ scaled, original, isMin: false, isMax: false });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: false,
        isUpperBound: false,
        original,
        scaled,
      });
    });

    it('should handle the minimum value', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);

      const original = 0;
      const scaled = 10;

      const result = scaler.scale(original);

      expect(result).eql({ scaled, original, isMin: true, isMax: false });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: true,
        isUpperBound: false,
        original,
        scaled,
      });
    });

    it('should handle the maximum value', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);

      const original = 100;
      const scaled = 20;

      const result = scaler.scale(original);

      expect(result).eql({ scaled, original, isMin: false, isMax: true });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: false,
        isUpperBound: true,
        original,
        scaled,
      });
    });

    it('should handle min=max case', () => {
      const config = { min: 100, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);

      const original = 100;
      const scaled = 15;

      const result = scaler.scale(original);

      expect(result).eql({ scaled, original, isMin: true, isMax: true });

      expect(scaler.descale(result.scaled)).toEqual({
        isLowerBound: false,
        isUpperBound: false,
        original,
        scaled,
      });
    });

    it('should throw an error for an invalid min/max config', () => {
      const config = { min: 100, max: 0, bound: { lower: 0, upper: 10 } };
      expect(() => new MinMaxScaler(config)).toThrow(
        'Invalid MinMaxScaler min-max config'
      );
    });

    it('should throw an error for an invalid lower/upper config', () => {
      const config = { min: 0, max: 10, bound: { lower: 20, upper: 10 } };
      expect(() => new MinMaxScaler(config)).toThrow(
        'Invalid MinMaxScaler bound config'
      );
    });

    it('should throw an error for an equal lower/upper config', () => {
      const config = { min: 0, max: 10, bound: { lower: 10, upper: 10 } };
      expect(() => new MinMaxScaler(config)).toThrow(
        'Invalid MinMaxScaler bound config'
      );
    });

    it('should throw an error on a value out of min/max', () => {
      const config = { min: 0, max: 10 };
      expect(() => new MinMaxScaler(config).scale(15)).toThrow(
        'Value out of min/max range'
      );
    });
  });

  describe('descale', () => {
    it('should be in bounds', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);

      expect(() => scaler.descale(5)).toThrow('Scaled value out of bounds');
      expect(() => scaler.descale(25)).toThrow('Scaled value out of bounds');
    });
  });

  describe('getMinMax', () => {
    it('should handle empty arrays', () => {
      const values = [];
      expect(() => MinMaxScaler.getMinMax(values)).toThrow(
        'An empty array supplied'
      );
    });

    it('should return one value arrays', () => {
      const values = [10];
      const { min, max } = MinMaxScaler.getMinMax(values);
      expect(min).toBe(10);
      expect(max).toBe(10);
    });

    it('should return the minimum and maximum values from an array', () => {
      const values = [10, 5, 20, 15, 30];
      const { min, max } = MinMaxScaler.getMinMax(values);
      expect(min).toBe(5);
      expect(max).toBe(30);
    });
  });
});
