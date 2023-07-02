export type IResult<T, E> = IResult.IOk<T> | IResult.IError<E>;

export namespace IResult {
    export interface IOk<T> {
        readonly type: "ok";
        readonly result: T;
    }

    export interface IError<E> {
        readonly type: "error";
        readonly result: E;
    }
}
