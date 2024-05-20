const kind = Symbol('Option');
const SomeSymbol = Symbol('Some');
const NoneSymbol = Symbol('None');

export interface Option<T> {
    [kind]: typeof SomeSymbol | typeof NoneSymbol;
    map: <R>(f: (input: T) => R) => Option<R>;
    flatMap: <R>(f: (input: T) => Option<R>) => Option<R>;
}
export namespace Option {
    export const Some = <T>(input: T): Option<T> => ({
        [kind]: SomeSymbol,
        map: (f) => Some(f(input)),
        flatMap: (f) => f(input),
    });
    export const None = <T>(): Option<T> => ({
        [kind]: NoneSymbol,
        map: () => None(),
        flatMap: () => None(),
    });
}
