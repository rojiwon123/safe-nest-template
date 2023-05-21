/**
 * Construct a type with the properties of T except for those in type K.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
