import { describe, test, expect, vi } from 'vitest';
import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisiteOutsideConnectivity } from '../src/prerequisites/outside-connectivity';

describe('PrerequisiteOutsideConnectivity class', () => {
  test('verify method returns success for successful outside connectivity', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true } as any);

    const result = await new PrerequisiteOutsideConnectivity({
      label: 'outside-connectivity',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for unsuccessful outside connectivity', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: false } as any);

    const result = await new PrerequisiteOutsideConnectivity({
      label: 'outside-Connectivity',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during outside connectivity check', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('Network error'));

    const result = await new PrerequisiteOutsideConnectivity({
      label: 'outside-connectivity',
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    spy.mockRestore();
  });
});
