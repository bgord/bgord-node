import * as z from 'zod';

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

const Page = z
  .number()
  .int()
  .positive()
  .default(1);
export type PageType = z.infer<typeof Page>;

export type PaginationType = { take: TakeType; skip: SkipType };
export type PaginationValuesType = Record<string, unknown>;

export class Pagination {
  static parse(values: PaginationValuesType, _take?: TakeType): PaginationType {
    const page = Page.parse(Number(values.page));
    const take = Take.parse(_take);

    const skip = (page - 1) * take;

    return { take, skip };
  }
}
