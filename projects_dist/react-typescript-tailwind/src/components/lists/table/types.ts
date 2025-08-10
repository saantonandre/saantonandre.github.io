/** Specifies a K key rendering method for a given T object. */
export type Formatter<T, K extends keyof T> = (
  value: T[K],
  obj?: T
) => React.ReactNode;

export type MiniFormatter<T> = (obj?: T) => React.ReactNode;
/**
 * Column specific sorting algorithm, if not defined for a column defaults to `(a,b)=>a>b?1:-1`
 * documentation for JS sort(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
export type Sorter<T, K extends keyof T> = (
  valueA: T[K],
  valueB: T[K],
  valueC: T,
  valueD: T
) => 1 | -1 | 0;

/** Specifies a K key valiadtion method for a given T object.
 * @returns [`true` if value is valid, reason why not valid or empty string]
 */
export type Validator<T, K extends keyof T> = (
  value: T[K],
  obj?: T
) => [boolean | undefined, string?];

export type ValidatorCol<T> = {
  [K in keyof T]: [string, Validator<T, K>?];
};
export type Corrector<T, K extends keyof T> = (value: T[K], obj?: T) => T[K];

export type CorrectorCol<T> = {
  [K in keyof T]: Corrector<T, K>;
};

export type Col<T> = {
  [K in keyof T]: [string, Formatter<T, K>?, Sorter<T, K>?];
};
export type FormatterObj<T> = {
  [K in keyof T]: Formatter<T, K>;
};
export type SorterObj<T> = {
  [K in keyof T]: Sorter<T, K>;
};
