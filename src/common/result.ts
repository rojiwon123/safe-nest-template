export type Result<O, E> = Result.Ok<O, E> | Result.Err<O, E>;
export namespace Result {
    const kind = Symbol('Result');
    const OkSymbol = Symbol('Ok');
    const ErrSymbol = Symbol('Err');
    export interface Ok<O, E> {
        [kind]: typeof OkSymbol;
        ok: O;
        match: <O2, E2>(fn1: (input: O) => O2, fn2: (input: E) => E2) => O2;
    }
    export interface Err<O, E> {
        [kind]: typeof ErrSymbol;
        err: E;
        match: <O2, E2>(fn1: (input: O) => O2, fn2: (input: E) => E2) => E2;
    }
    export const Ok = <O, E>(input: O): Ok<O, E> => ({
        [kind]: OkSymbol,
        ok: input,
        match: (fn) => fn(input),
    });
    export const Err = <O, E>(input: E): Err<O, E> => ({
        [kind]: ErrSymbol,
        err: input,
        match: (_, fn) => fn(input),
    });
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
