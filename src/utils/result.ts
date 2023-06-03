import { IError, IOk, IResult } from "@TYPE";

export namespace Result {
  export namespace Ok {
    export const is = <T, E>(result: IResult<T, E>): result is IOk<T> =>
      result.type === "ok";

    export const map = <T>(result: T): IOk<T> => ({ type: "ok", result });

    export const flatten = <T>(ok: IOk<T>): T => ok.result;
  }
  export namespace Error {
    export const is = <T, E>(result: IResult<T, E>): result is IError<E> =>
      result.type === "error";

    export const map = <E>(result: E): IError<E> => ({ type: "error", result });

    export const flatten = <E>(ok: IError<E>): E => ok.result;
  }
}
