import { describe, test, expect, vi } from 'vitest';
import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisiteOutsideConnectivityStrategyConfigType,
  PrerequisiteOutsideConnectivityVerificator,
} from '../src/prerequisites/outside-connectivity';

describe('PrerequisiteOutsideConnectivityVerificator class', () => {
  test('verify method returns success for successful outside connectivity', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockImplementationOnce(async () => ({ ok: true } as any));

    const config: PrerequisiteOutsideConnectivityStrategyConfigType = {
      label: 'Outside Connectivity Success',
      strategy: PrerequisiteStrategyEnum.outsideConnectivity,
    };

    const result = await PrerequisiteOutsideConnectivityVerificator.verify(
      config
    );

    expect(result).toBe(PrerequisiteStatusEnum.success);
    spy.mockRestore();
  });

  test('verify method returns failure for unsuccessful outside connectivity', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockImplementationOnce(async () => ({ ok: false } as any));

    const config: PrerequisiteOutsideConnectivityStrategyConfigType = {
      label: 'Outside Connectivity Success',
      strategy: PrerequisiteStrategyEnum.outsideConnectivity,
    };

    const result = await PrerequisiteOutsideConnectivityVerificator.verify(
      config
    );

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    spy.mockRestore();
  });

  test('verify method returns failure on error during outside connectivity check', async () => {
    const spy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('Network error'));

    const config: PrerequisiteOutsideConnectivityStrategyConfigType = {
      label: 'Outside Connectivity Error',
      strategy: PrerequisiteStrategyEnum.outsideConnectivity,
    };

    const result = await PrerequisiteOutsideConnectivityVerificator.verify(
      config
    );

    expect(result).toBe(PrerequisiteStatusEnum.failure);

    spy.mockRestore();
  });
});
