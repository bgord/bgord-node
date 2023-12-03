import { describe, test, expect, vi } from 'vitest';

import {
  PrerequisiteStatusEnum,
  PrerequisiteStrategyEnum,
} from '../src/prerequisites';
import {
  PrerequisitePrismaStrategyConfigType,
  PrerequisitePrismaVerificator,
} from '../src/prerequisites/prisma';

describe('PrerequisitePrismaVerificator class', () => {
  test('verify method returns success for non-empty table', async () => {
    const spy = vi.fn().mockResolvedValue(['mock']);

    const config: PrerequisitePrismaStrategyConfigType = {
      label: 'Non-Empty Table',
      strategy: PrerequisiteStrategyEnum.prisma,
      client: { $queryRaw: spy },
    };

    const result = await PrerequisitePrismaVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.success);
    expect(spy).toBeCalled();
  });

  test('verify method returns failure for empty table', async () => {
    const spy = vi.fn().mockResolvedValue([]);

    const config: PrerequisitePrismaStrategyConfigType = {
      label: 'Non-Empty Table',
      strategy: PrerequisiteStrategyEnum.prisma,
      client: { $queryRaw: spy },
    };

    const result = await PrerequisitePrismaVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    expect(spy).toBeCalled();
  });

  test('verify method returns failure on error during database query', async () => {
    const spy = vi.fn().mockRejectedValue(new Error('Database query error'));

    const config: PrerequisitePrismaStrategyConfigType = {
      label: 'Non-Empty Table',
      strategy: PrerequisiteStrategyEnum.prisma,
      client: { $queryRaw: spy },
    };

    const result = await PrerequisitePrismaVerificator.verify(config);

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    expect(spy).toBeCalled();
  });
});
