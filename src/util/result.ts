import { freezeObject } from "./fn";

const kind = Symbol("Result");
const OkSymbol = Symbol("Ok");
const ErrSymbol = Symbol("Err");

export interface Result<O, E> {
    readonly [kind]: typeof OkSymbol | typeof ErrSymbol;
    readonly mapOk: <O2>(f: (ok: O) => O2) => Result<O2, E>;
    readonly mapErr: <E2>(f: (err: E) => E2) => Result<O, E2>;
    readonly andThen: <O2, E2>(f: (ok: O) => Result<O2, E2>) => Result<O2, E | E2>;
    readonly match: <O2, E2>(fn1: (input: O) => O2, fn2: (input: E) => E2) => O2 | E2;
    readonly async: {
        readonly [kind]: typeof OkSymbol | typeof ErrSymbol;
        readonly mapOk: <O2>(f: (ok: O) => Promise<O2>) => Promise<Result<O2, E>>;
        readonly mapErr: <E2>(f: (err: E) => Promise<E2>) => Promise<Result<O, E2>>;
        readonly andThen: <O2, E2>(f: (ok: O) => Promise<Result<O2, E2>>) => Promise<Result<O2, E | E2>>;
    };
}

export namespace Result {
    export const Ok = <O, E>(input: O): Result<O, E> =>
        freezeObject({
            [kind]: OkSymbol,
            mapOk: (f) => Ok(f(input)),
            mapErr: () => Ok(input),
            andThen: (f) => f(input),
            match: (fn) => fn(input),
            async: freezeObject({
                [kind]: OkSymbol,
                mapOk: async (f) => Ok(await f(input)),
                mapErr: async () => Ok(input),
                andThen: async (f) => f(input),
            }),
        });
    export const Err = <O, E>(input: E): Result<O, E> =>
        freezeObject({
            [kind]: ErrSymbol,
            mapOk: () => Err(input),
            mapErr: (f) => Err(f(input)),
            andThen: () => Err(input),
            match: (_, fn) => fn(input),
            async: freezeObject({
                [kind]: ErrSymbol,
                mapOk: async () => Err(input),
                mapErr: async (f) => Err(await f(input)),
                andThen: async <O2, E2>() => Err<O2, E | E2>(input),
            }),
        });
}
