export type IResult<T, E> = IResult.IOk<T> | IResult.IError<E>;
export declare namespace IResult {
    interface IOk<T> {
        readonly type: "ok";
        readonly result: T;
    }
    interface IError<E> {
        readonly type: "error";
        readonly result: E;
    }
}
