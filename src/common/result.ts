import { Option } from './option';

const kind = Symbol('Result');
const OkSymbol = Symbol('Ok');
const ErrSymbol = Symbol('Err');

export interface Result<O, E> {
    readonly [kind]: typeof OkSymbol | typeof ErrSymbol;
    readonly ok: Option<O>;
    readonly err: Option<E>;
    /**
     * lift method for ok case
     */
    readonly mapOk: <O2>(f: (ok: O) => O2) => Result<O2, E>;
    /**
     * lift method for err case
     */
    readonly mapErr: <E2>(f: (err: E) => E2) => Result<O, E2>;
    /**
     * Ok flatMap method
     */
    readonly andThen: <O2, E2>(
        f: (ok: O) => Result<O2, E2>,
    ) => Result<O2, E | E2>;
    readonly match: <O2, E2>(
        fn1: (input: O) => O2,
        fn2: (input: E) => E2,
    ) => O2 | E2;
}

export namespace Result {
    const define = <O, E>(result: Result<O, E>) =>
        Object.defineProperties(result, {
            [kind]: { writable: false, enumerable: false, configurable: false },
            ok: { writable: false, enumerable: false, configurable: false },
            err: { writable: false, enumerable: false, configurable: false },
            mapOk: { writable: false, enumerable: false, configurable: false },
            mapErr: { writable: false, enumerable: false, configurable: false },
            andThen: {
                writable: false,
                enumerable: false,
                configurable: false,
            },
            match: { writable: false, enumerable: false, configurable: false },
        });
    export const Ok = <O, E>(input: O): Result<O, E> =>
        define<O, E>({
            [kind]: OkSymbol,
            ok: Option.Some(input),
            err: Option.None(),
            mapOk: (f) => Ok(f(input)),
            mapErr: () => Ok(input),
            andThen: (f) => f(input),
            match: (fn) => fn(input),
        });
    export const Err = <O, E>(input: E): Result<O, E> =>
        define<O, E>({
            [kind]: ErrSymbol,
            ok: Option.None(),
            err: Option.Some(input),
            mapOk: () => Err(input),
            mapErr: (f) => Err(f(input)),
            andThen: () => Err(input),
            match: (_, fn) => fn(input),
        });

    export const match =
        <O1, O2, E1, E2>(fn1: (input: O1) => O2, fn2: (input: E1) => E2) =>
        (result: Result<O1, E1>): O2 | E2 =>
            result.match(fn1, fn2);
}

/**
 * example
const parse = (input: string): Result<object, Error> => {
    try {
        return Result.Ok(JSON.parse(input));
    } catch {
        return Result.Err(Error('fail to parsing'));
    }
};
parse('123').match(console.log, console.error);
*/
