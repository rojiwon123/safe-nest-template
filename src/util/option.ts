import { freeze } from "./fn";
import { Result } from "./result";

export type Option<T> = Some<T> | None;

const kind = Symbol("Option");

interface Some<T> {
    readonly [kind]: "Some";
    readonly get: () => T;
}

interface None {
    readonly [kind]: "None";
    readonly get: () => null;
}

export namespace Option {
    export const Some = <T>(input: T): Option<T> => freeze({ [kind]: "Some", get: () => input });
    export const None = (): None => freeze({ [kind]: "None", get: () => null });
    export const of = <T>(input: T): Option<NonNullable<T>> => (input == null ? Option.None() : Option.Some(input));

    export const isSome = <T>(option: Option<T>): option is Some<T> => option[kind] === "Some";

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-60--36--62- reference} */
    export const map =
        <T, U>(f: (input: T) => U) =>
        (input: Option<T>): Option<U> =>
            !isSome(input) ? input : Some(f(input.get()));

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-60--42--62- reference} */
    export const ap =
        <T, U>(f: Option<(input: T) => U>) =>
        (input: Option<T>): Option<U> =>
            !isSome(f) ? f
            : !isSome(input) ? input
            : Some(f.get()(input.get()));

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-62--62--61- reference} */
    export const flatMap =
        <T, U>(f: (input: T) => Option<U>) =>
        (input: Option<T>): Option<U> =>
            !isSome(input) ? input : f(input.get());

    export const mapAsync =
        <T, U>(f: (input: T) => U | Promise<U>) =>
        async (input: Option<T>): Promise<Option<Awaited<U>>> =>
            !isSome(input) ? input : Some(await f(input.get()));

    export const apAsync =
        <T, U>(f: Option<(input: T) => U | Promise<U>>) =>
        async (input: Option<T>): Promise<Option<Awaited<U>>> =>
            !isSome(f) ? f
            : !isSome(input) ? input
            : Some(await f.get()(input.get()));

    export const flatMapAsync =
        <T, O>(f: (input: T) => Option<O> | Promise<Option<O>>) =>
        async (input: Option<T>): Promise<Option<O>> =>
            !isSome(input) ? input : f(input.get());

    export const wait = async <O>(input: Option<O | Promise<O>>): Promise<Option<Awaited<O>>> =>
        mapAsync(async (i: O | Promise<O>) => i)(input);

    // ap + lazy + (async) 연산

    export const apLazy =
        <T, U>(f: Option<(input: T) => U>) =>
        <Args extends unknown[]>(g: (...args: Args) => Option<T>, ...args: Args): Option<U> =>
            ap(f)(g(...args));

    export const apLazyAsync =
        <T, U>(f: Option<(input: T) => U | Promise<U>>) =>
        async <Args extends unknown[]>(g: (...args: Args) => Option<T> | Promise<Option<T>>, ...args: Args): Promise<Option<Awaited<U>>> =>
            apAsync(f)(await g(...args));

    export const match =
        <T, U, V>(f1: (input: T) => U, f2: () => V) =>
        (input: Option<T>): U | V =>
            isSome(input) ? f1(input.get()) : f2();

    export const toResult =
        <E>(err: E) =>
        <T>(input: Option<T>): Result<T, E> =>
            isSome(input) ? Result.Ok(input.get()) : Result.Err(err);
}
