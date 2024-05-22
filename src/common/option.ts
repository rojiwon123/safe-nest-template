const kind = Symbol('Option');
const SomeSymbol = Symbol('Some');
const NoneSymbol = Symbol('None');

export interface Option<T> {
    [kind]: typeof SomeSymbol | typeof NoneSymbol;
    map: <R>(f: (input: T) => R) => Option<R>;
    flatMap: <R>(f: (input: T) => Option<R>) => Option<R>;
    match: <R1, R2>(fn1: (input: T) => R1, fn2: () => R2) => R1 | R2;
}
export namespace Option {
    const define = <T>(option: Option<T>) =>
        Object.defineProperties(option, {
            [kind]: { writable: false, enumerable: false, configurable: false },
            map: { writable: false, enumerable: false, configurable: false },
            flatMap: {
                writable: false,
                enumerable: false,
                configurable: false,
            },
            match: { writable: false, enumerable: false, configurable: false },
        });
    export const Some = <T>(input: T): Option<T> =>
        define({
            [kind]: SomeSymbol,
            map: (f) => Some(f(input)),
            flatMap: (f) => f(input),
            match: (fn) => fn(input),
        });
    export const None = <T>(): Option<T> =>
        define<T>({
            [kind]: NoneSymbol,
            map: () => None(),
            flatMap: () => None(),
            match: (_, fn) => fn(),
        });
    export const unit = <T>(
        input: T | null | undefined,
    ): Option<NonNullable<T>> =>
        input === null || input === undefined
            ? Option.None()
            : Option.Some(input);
}
