import { IResult } from "@APP/api/types";

export namespace Result {
    export namespace Ok {
        export const is = <T, E>(
            result: IResult<T, E>,
        ): result is IResult.IOk<T> => result.type === "ok";

        export const map = <T>(result: T): IResult.IOk<T> => ({
            type: "ok",
            result,
        });

        export const flatten = <T>(ok: IResult.IOk<T>): T => ok.result;
    }
    export namespace Error {
        export const is = <T, E>(
            result: IResult<T, E>,
        ): result is IResult.IError<E> => result.type === "error";

        export const map = <E>(result: E): IResult.IError<E> => ({
            type: "error",
            result,
        });

        export const flatten = <E>(ok: IResult.IError<E>): E => ok.result;
    }
}
