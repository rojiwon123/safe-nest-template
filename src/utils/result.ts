import { Failure } from "./failure";

export type Result<T, E extends Result.Error.IFailure> =
    | Result.Ok<T>
    | Result.Error<E>;

export namespace Result {
    export interface Ok<T> {
        readonly type: "ok";
        readonly ok: T;
    }

    export namespace Ok {
        export const is = <T, E extends Error.IFailure>(
            result: Result<T, E>,
        ): result is Result.Ok<T> => result.type === "ok";

        export const map = <T>(ok: T): Result.Ok<T> => ({
            type: "ok",
            ok,
        });

        export const flatten = <T>(ok: Result.Ok<T>): T => ok.ok;

        export const lift =
            <T, R>(mapper: (input: T) => R) =>
            (ok: Result.Ok<T>): Result.Ok<R> =>
                Result.Ok.map(mapper(Result.Ok.flatten(ok)));

        export const asyncLift =
            <T, R>(mapper: (input: T) => Promise<R>) =>
            async (ok: Result.Ok<T>): Promise<Result.Ok<R>> =>
                Result.Ok.map(await mapper(Result.Ok.flatten(ok)));
    }

    export interface Error<E extends Error.IFailure> {
        readonly type: "error";
        readonly error: E;
    }

    export namespace Error {
        export type IFailure = Failure.Internal | Failure.External<string>;
        export const is = <T, E extends Error.IFailure>(
            result: Result<T, E>,
        ): result is Result.Error<E> => result.type === "error";

        export const map = <E extends Error.IFailure>(
            error: E,
        ): Result.Error<E> => ({
            type: "error",
            error,
        });

        export const flatten = <E extends Error.IFailure>(
            error: Result.Error<E>,
        ): E => error.error;

        export const lift =
            <T extends Error.IFailure, R extends Error.IFailure>(
                mapper: (input: T) => R,
            ) =>
            (error: Result.Error<T>): Result.Error<R> =>
                Result.Error.map(mapper(Result.Error.flatten(error)));

        export const asyncLift =
            <T extends Error.IFailure, R extends Error.IFailure>(
                mapper: (input: T) => Promise<R>,
            ) =>
            async (error: Result.Error<T>): Promise<Result.Error<R>> =>
                Result.Error.map(await mapper(Result.Error.flatten(error)));
    }

    export const flatten = <T, E extends Error.IFailure>(
        input: Result<T, E>,
    ): T | E =>
        Result.Ok.is(input)
            ? Result.Ok.flatten(input)
            : Result.Error.flatten(input);

    export const lift =
        <
            T,
            E extends Error.IFailure,
            TR = T,
            ER extends Error.IFailure = E,
        >(mapper: {
            ok: (input: T) => TR;
            error: (input: E) => ER;
        }) =>
        (input: Result<T, E>): Result<TR, ER> =>
            Result.Ok.is(input)
                ? Result.Ok.lift(mapper.ok)(input)
                : Result.Error.lift(mapper.error)(input);
}
