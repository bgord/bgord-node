export type Constructor<T> = new (...args: any[]) => T;

export type Falsy<T> = T | null | undefined;

export type Nullable<T> = T | null;
