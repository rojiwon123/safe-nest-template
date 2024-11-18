import { freeze } from "./fn";

export type Result<O, E> = Ok<O> | Err<E>;

const kind = Symbol("Result");

interface Ok<O> {
    readonly [kind]: "Ok";
    readonly get: () => O;
}

interface Err<E> {
    readonly [kind]: "Err";
    readonly get: () => E;
}

export namespace Result {
    export const Ok = <O>(o: O): Result<O, never> => freeze({ [kind]: "Ok", get: () => o });
    export const Err = <E>(e: E): Result<never, E> => freeze({ [kind]: "Err", get: () => e });

    export const isOk = <O, E>(result: Result<O, E>): result is Ok<O> => result[kind] === "Ok";

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-60--36--62- reference} */
    export const map =
        <T, U>(f: (input: T) => U) =>
        <E>(r: Result<T, E>): Result<U, E> =>
            !isOk(r) ? r : Ok(f(r.get()));

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-60--42--62- reference} */
    export const ap =
        <T, U, E>(f: Result<(input: T) => U, E>) =>
        <E2>(r: Result<T, E2>): Result<U, E | E2> =>
            !isOk(f) ? f
            : !isOk(r) ? r
            : Ok(f.get()(r.get()));

    /** {@link https://hackage.haskell.org/package/base-4.20.0.1/docs/Prelude.html#v:-62--62--61- reference} */
    export const flatMap =
        <T, O, E>(f: (input: T) => Result<O, E>) =>
        <E2>(r: Result<T, E2>): Result<O, E | E2> =>
            !isOk(r) ? r : f(r.get());

    /// 기본 세 연산을 비동기 작업과 연결하여 사용하는 함수

    export const mapAsync =
        <T, U>(f: (input: T) => U | Promise<U>) =>
        async <E>(r: Result<T, E>): Promise<Result<Awaited<U>, E>> =>
            !isOk(r) ? r : Ok(await f(r.get()));

    export const apAsync =
        <T, U, E>(f: Result<(input: T) => U | Promise<U>, E>) =>
        async <E2>(r: Result<T, E2>): Promise<Result<Awaited<U>, E | E2>> =>
            !isOk(f) ? f
            : !isOk(r) ? r
            : Ok(await f.get()(r.get()));

    export const flatMapAsync =
        <T, O, E>(f: (input: T) => Result<O, E> | Promise<Result<O, E>>) =>
        async <E2>(r: Result<T, E2>): Promise<Result<O, E | E2>> =>
            !isOk(r) ? r : f(r.get());

    export const wait = async <O, E>(r: Result<O | Promise<O>, E>): Promise<Result<Awaited<O>, E>> =>
        mapAsync(async (i: O | Promise<O>) => i)(r);

    /// Err case에 대해 사용하는 함수

    /** 예외 케이스의 데이터를 변형할 때 사용 */
    export const mapErr =
        <T, U>(f: (input: T) => U) =>
        <O>(r: Result<O, T>): Result<O, U> =>
            isOk(r) ? r : Err(f(r.get()));

    // ap + lazy + (async) 연산

    export const apLazy =
        <T, U, E>(f: Result<(input: T) => U, E>) =>
        <Args extends unknown[], E2 = never>(r: (...args: Args) => Result<T, E2>, ...args: Args): Result<U, E | E2> =>
            ap(f)(r(...args));

    export const apLazyAsync =
        <T, U, E>(f: Result<(input: T) => U | Promise<U>, E>) =>
        async <Args extends unknown[], E2 = never>(
            r: (...args: Args) => Result<T, E2> | Promise<Result<T, E2>>,
            ...args: Args
        ): Promise<Result<Awaited<U>, E | E2>> =>
            apAsync(f)(await r(...args));

    export const match =
        <O, O2, E, E2>(f1: (input: O) => O2, f2: (input: E) => E2) =>
        (r: Result<O, E>): O2 | E2 =>
            isOk(r) ? f1(r.get()) : f2(r.get());
}
