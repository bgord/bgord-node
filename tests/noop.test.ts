import { describe, test, expect } from 'vitest';

import { noop, anoop } from '../src/noop';

describe('Noop', () => {
  test('does nothing', () => noop());
});

describe('Anoop', () => {
  test('does nothing', async () => {
    try {
      await anoop();
    } catch (error) {
      expect.unreachable();
    }
  });
});
