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
});
