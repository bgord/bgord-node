import { it, expect, describe } from 'vitest';
import { MinMaxScaler } from '../src/min-max-scaler';

describe('MinMaxScaler', () => {
  describe('scale', () => {
    it('should scale a value within the configured range', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(50);
      expect(scaledValue).eq(15);
    });

    it('should scale a value within the configured range up to 2 decimal places', () => {
      const config = { min: 0, max: 27, bound: { lower: 0, upper: 9 } };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(5);
      expect(scaledValue).eq(1.67);
    });

    it('should scale a value with default range', () => {
      const config = { min: 0, max: 100 };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(50);
      expect(scaledValue).eq(0.5);
    });

    it('should handle the minimum value', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(0);
      expect(scaledValue).eq(10);
    });

    it('should handle the maximum value', () => {
      const config = { min: 0, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(100);
      expect(scaledValue).eq(20);
    });

    it('should handle min=max case', () => {
      const config = { min: 100, max: 100, bound: { lower: 10, upper: 20 } };
      const scaler = new MinMaxScaler(config);
      const scaledValue = scaler.scale(100);
      expect(scaledValue).eq(15);
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

  describe('getMinMax', () => {
    it('should hanle empty arrays', () => {
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

// scale out of min/max
