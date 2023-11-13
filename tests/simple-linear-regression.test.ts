import { describe, test, expect } from 'vitest';

import { SLR } from '../src/simple-linear-regression';

describe('SimpleLinearRegression', () => {
  test('predicts correctly from two pairs', async () => {
    const model = SLR.fromPairs([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
    ]);
    expect(model.predict(4)).toEqual(8);
  });

  test('predicts correctly from three pairs', async () => {
    const model = SLR.fromPairs([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]);
    expect(model.predict(10)).toEqual(20);
  });

  test('predicts correctly from three pairs', async () => {
    const model = SLR.fromPairs([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]);
    expect(model.predict(10)).toEqual(20);
  });

  test('works the same way when constructed directly', async () => {
    const model = SLR.fromPairs([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]);
    const params = model.inspect();
    const reconstructed = new SLR(params);
    expect(reconstructed.predict(10)).toEqual(20);
  });

  test('uncalculable result', async () => {
    expect(() =>
      SLR.fromPairs([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ])
    ).toThrow('Unable to create the model');
  });

  describe('validations', () => {
    test('Sum of x values is too big', async () => {
      expect(() =>
        SLR.fromPairs([
          { x: Number.MAX_SAFE_INTEGER, y: 2 },
          { x: Number.MAX_SAFE_INTEGER, y: 4 },
        ])
      ).toThrow('Sum of x values is too big');
    });

    test('Sum of y values is too big', async () => {
      expect(() =>
        SLR.fromPairs([
          { y: Number.MAX_SAFE_INTEGER, x: 2 },
          { y: Number.MAX_SAFE_INTEGER, x: 4 },
        ])
      ).toThrow('Sum of y values is too big');
    });

    test('Sum of x squared values is too big', async () => {
      expect(() =>
        SLR.fromPairs([
          { x: Number.MAX_SAFE_INTEGER / 4, y: 2 },
          { x: Number.MAX_SAFE_INTEGER / 4, y: 4 },
        ])
      ).toThrow('Sum of x squared values is too big');
    });

    test('At least two pairs needed - empty', async () => {
      expect(() => SLR.fromPairs([])).toThrow('At least two pairs needed');
    });

    test('At least two pairs needed - one pair', async () => {
      expect(() => SLR.fromPairs([{ x: 1, y: 2 }])).toThrow(
        'At least two pairs needed'
      );
    });
  });
});
