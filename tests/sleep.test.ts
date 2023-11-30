import { describe, test, expect } from 'vitest';

import { Stopwatch } from '../src/stopwatch';
import { sleep } from '../src/sleep';

describe('sleep function', () => {
  test('resolves after the specified time', async () => {
    const stopwatch = new Stopwatch();
    await sleep({ ms: 50 });
    expect(stopwatch.stop().durationMs).toBeGreaterThanOrEqual(50);
  });
});
