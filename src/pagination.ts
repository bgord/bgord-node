import * as z from 'zod';
import { StringToNumber } from './schema';

const Take = z
  .number()
  .int()
  .positive()
  .default(10);
type TakeType = z.infer<typeof Take>;

const Skip = z
  .number()
  .int()
  .positive();
type SkipType = z.infer<typeof Skip>;

const Page = z.union([StringToNumber, z.undefined()]).default('1');
export type PageType = z.infer<typeof Page>;

export type PaginationType = {
  values: { take: TakeType; skip: SkipType };
  page: PageType;
};
export type PaginationValuesType = Record<string, unknown>;

export type PaginationExhaustedConfig = {
  total: number;
  pagination?: PaginationType;
};

export class Pagination {
  static parse(values: PaginationValuesType, _take?: TakeType): PaginationType {
    const page = Page.parse(values.page);
    const take = Take.parse(_take);

    const skip = (page - 1) * take;

    return { values: { take, skip }, page };
  }

  static isExhausted(config: PaginationExhaustedConfig): boolean {
    if (!config.pagination) return true;

    const lastPage = Math.ceil(config.total / config.pagination.values.take);
    const currentPage = config.pagination.page;

    return lastPage <= currentPage;
  }
}

export type Paged<T> = { result: T[]; meta: { exhausted: boolean } };
