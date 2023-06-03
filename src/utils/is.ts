import { isNumber, isString } from "@fxts/core";

type Include<T, U> = T extends U ? T : never;

export const isNull = <T>(input: T): input is Include<T, null> =>
  input === null;

export const isNotNull = <T>(input: T): input is Extract<T, null> =>
  !isNull(input);

export const isArray = <T>(input: T): input is Include<T, unknown[]> =>
  Array.isArray(input);

export const isStringArray = <T>(input: T): input is Include<T, string[]> =>
  isArray(input) && input.every(isString);

export const isNumberArray = <T>(input: T): input is Include<T, number[]> =>
  isArray(input) && input.every(isNumber);
