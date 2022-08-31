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

export type TotalType = number;

export type ExhaustedType = boolean;

export type PaginationExhaustedConfig = {
  total: TotalType;
  pagination?: PaginationType;
};

export type PaginationPrepareConfigType<T> = {
  total: TotalType;
  pagination?: PaginationType;
  result: T[];
};

export class Pagination {
  static parse(values: PaginationValuesType, _take?: TakeType): PaginationType {
    const page = Page.parse(values.page);
    const take = Take.parse(_take);

    const skip = (page - 1) * take;

    return { values: { take, skip }, page };
  }

  static prepare<T>(config: PaginationPrepareConfigType<T>) {
    const exhausted = Pagination.isExhausted(config);

    return { result: config.result, meta: { exhausted } };
  }

  static isExhausted(config: PaginationExhaustedConfig): ExhaustedType {
    if (!config.pagination) return true;

    const lastPage = Math.ceil(config.total / config.pagination.values.take);
    const currentPage = config.pagination.page;

    return lastPage <= currentPage;
  }

  static empty = { result: [], meta: { exhausted: true } };
}

export type Paged<T> = { result: T[]; meta: { exhausted: boolean } };
