export type Result<T, E> = Result.Ok<T> | Result.Error<E>;

export namespace Result {
    const _await =
        <T, R>(cb: (input: T) => R) =>
        (input: T | Promise<T>) =>
            input instanceof Promise ? input.then(cb) : cb(input);

    export interface Ok<T> {
        readonly type: "ok";
        readonly ok: T;
    }
    export namespace Ok {
        export const is = <T, E>(
            result: Result<T, E>,
        ): result is Result.Ok<T> => result.type === "ok";

        export const map = <T>(ok: T): Result.Ok<T> => ({ type: "ok", ok });
        export const flatten = <T>(ok: Result.Ok<T>): T => ok.ok;

        export function lift<T, R>(
            fn: (input: T) => R,
        ): (input: Result.Ok<T>) => Result.Ok<R>;
        export function lift<T, R>(
            fn: (input: T) => Promise<R>,
        ): (input: Result.Ok<T>) => Promise<Result.Ok<R>>;
        export function lift<T, R>(fn: (input: T) => R | Promise<R>) {
            return (input: Result.Ok<T>) => _await(map)(fn(flatten(input)));
        }
    }

    export interface Error<E> {
        readonly type: "error";
        readonly error: E;
    }
    export namespace Error {
        export const is = <T, E>(
            result: Result<T, E>,
        ): result is Result.Error<E> => result.type === "error";

        export const map = <E>(error: E): Result.Error<E> => ({
            type: "error",
            error,
        });
        export const flatten = <E>(error: Result.Error<E>): E => error.error;

        export function lift<E, R>(
            fn: (input: E) => R,
        ): (input: Result.Error<E>) => Result.Error<R>;
        export function lift<E, R>(
            fn: (input: E) => Promise<R>,
        ): (input: Result.Error<E>) => Promise<Result.Error<R>>;
        export function lift<E, R>(fn: (input: E) => R | Promise<R>) {
            return (input: Result.Error<E>) => _await(map)(fn(flatten(input)));
        }
    }
}
