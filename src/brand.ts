import { z } from 'zod';

export type Brand<B extends string, T> = { _brand: B } & T;

export function toBrand<T>(schema: z.Schema<unknown>) {
  return schema.transform(x => (x as unknown) as T);
}
