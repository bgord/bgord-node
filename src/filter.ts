import * as z from 'zod';

export type DefaultFilterSchemaType = z.ZodRawShape;
export type FilterValuesType = Record<string, unknown>;
export type FilterSchemaType<T extends DefaultFilterSchemaType> = z.ZodObject<
  T
>;

export type FilterParseConfigType<T extends DefaultFilterSchemaType> = {
  schema: FilterSchemaType<T>;
  values: FilterValuesType;
};

export class Filter<T extends DefaultFilterSchemaType> {
  constructor(private readonly schema: FilterSchemaType<T>) {}

  parse(values: FilterValuesType) {
    return Filter._parse({ schema: this.schema, values });
  }

  default() {
    return this.parse({});
  }

  static parse<T extends DefaultFilterSchemaType>(
    config: FilterParseConfigType<T>
  ) {
    return Filter._parse(config);
  }

  static default<T extends DefaultFilterSchemaType>(
    config: Omit<FilterParseConfigType<T>, 'values'>
  ) {
    return Filter._parse({ schema: config.schema, values: {} });
  }

  private static _parse<T extends DefaultFilterSchemaType>(
    config: FilterParseConfigType<T>
  ) {
    const result = config.schema.safeParse(config.values);

    return result.success ? result.data : undefined;
  }
}
