import { test, it, expect } from 'vitest';

import { Approximation } from '../src/approximation';

test('Approximation', () => {
  test('float', () => {
    it('should round to 2 decimal places by default', () => {
      const result = Approximation.float(3.14159265);
      expect(result).toEqual(3.14);
    });

    it('should round to the specified decimal places', () => {
      const result = Approximation.float(3.14159265, 3);
      expect(result).toEqual(3.142);
    });

    it('should handle negative numbers', () => {
      const result = Approximation.float(-3.14159265);
      expect(result).toEqual(-3.14);
    });
  });
});
