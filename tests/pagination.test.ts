import { describe, it, expect } from 'vitest';
import { Pagination } from '../src/pagination';

describe('Pagination', () => {
  it('should parse pagination values correctly', () => {
    const take = 10;
    const parsed = Pagination.parse({ page: 2 }, take);

    expect(parsed.page).toBe(2);
    expect(parsed.values.take).toBe(10);
    expect(parsed.values.skip).toBe(10);
  });

  it('should prepare paged data with correct metadata', () => {
    const config = {
      total: 50,
      pagination: { values: { take: 10, skip: 10 }, page: 2 },
      result: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    };

    const paged = Pagination.prepare(config);

    expect(paged.result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(paged.meta.exhausted).toBe(false);
    expect(paged.meta.currentPage).toBe(2);
    expect(paged.meta.previousPage).toBe(1);
    expect(paged.meta.nextPage).toBe(3);
    expect(paged.meta.lastPage).toBe(5);
    expect(paged.meta.total).toBe(50);
  });

  it('should determine if pagination is exhausted', () => {
    const config = {
      total: 25,
      pagination: { values: { take: 10, skip: 10 }, page: 3 },
    };

    const exhausted = Pagination.isExhausted(config);

    expect(exhausted).toBe(true);
  });

  it('should return empty paged data', () => {
    const emptyPaged = Pagination.empty;

    expect(emptyPaged.result).toEqual([]);
    expect(emptyPaged.meta.exhausted).toBe(true);
    expect(emptyPaged.meta.currentPage).toBe(1);
    expect(emptyPaged.meta.previousPage).toBe(undefined);
    expect(emptyPaged.meta.nextPage).toBe(undefined);
    expect(emptyPaged.meta.lastPage).toBe(1);
    expect(emptyPaged.meta.total).toBe(0);
  });

  it('should get first page correctly', () => {
    const firstPage = Pagination.getFirstPage({ take: 15 });

    expect(firstPage.page).toBe(1);
    expect(firstPage.values.take).toBe(15);
    expect(firstPage.values.skip).toBe(0);
  });
});
