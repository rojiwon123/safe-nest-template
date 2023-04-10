export const isNull = (input: unknown): input is null => input === null;

export const isUndefined = (input: unknown): input is undefined =>
  input === undefined;

export const isArray = (input: unknown): input is unknown[] =>
  Array.isArray(input);

export const isString = (input: unknown): input is string =>
  typeof input === "string";

export const isStringArray = (input: unknown): input is string[] =>
  isArray(input) && input.every(isString);

export const isNumber = (input: unknown): input is number =>
  typeof input === "number";

export const isNumberArray = (input: unknown): input is number[] =>
  isArray(input) && isNumber(input);
