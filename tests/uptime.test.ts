import { describe, test, expect, vi } from 'vitest';
import { Uptime } from '../src/uptime';

describe('Uptime class', () => {
  test('get method returns uptime in seconds and formatted duration', () => {
    const spy = vi.spyOn(process, 'uptime').mockReturnValue(12345);

    const result = Uptime.get();

    expect(result.seconds).toBe(12345);
    expect(result.formatted).toBe('about 3 hours ago');

    spy.mockRestore();
  });
});
