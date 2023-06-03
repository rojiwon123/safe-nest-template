export type IResult<T, E> = IOk<T> | IError<E>;

export interface IOk<T> {
  readonly type: "ok";
  readonly result: T;
}

export interface IError<E> {
  readonly type: "error";
  readonly result: E;
}
