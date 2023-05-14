export type Constructor<T> = new (...args: any[]) => T;

export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export type Falsy<T> = T | null | undefined;

export type Nullable<T> = T | null;
