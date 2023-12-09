import { describe, test, expect, vi } from 'vitest';

import { PrerequisiteStatusEnum } from '../src/prerequisites';
import { PrerequisitePrisma } from '../src/prerequisites/prisma';

describe('PrerequisitePrisma class', () => {
  test('verify method returns success for non-empty table', async () => {
    const spy = vi.fn().mockResolvedValue(['mock']);

    const result = await new PrerequisitePrisma({
      label: 'prisma',
      client: { $queryRaw: spy },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.success);
    expect(spy).toBeCalled();
  });

  test('verify method returns failure for empty table', async () => {
    const spy = vi.fn().mockResolvedValue([]);

    const result = await new PrerequisitePrisma({
      label: 'prisma',
      client: { $queryRaw: spy },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    expect(spy).toBeCalled();
  });

  test('verify method returns failure on error during database query', async () => {
    const spy = vi.fn().mockRejectedValue(new Error('Database query error'));

    const result = await new PrerequisitePrisma({
      label: 'prisma',
      client: { $queryRaw: spy },
    }).verify();

    expect(result).toBe(PrerequisiteStatusEnum.failure);
    expect(spy).toBeCalled();
  });
});
