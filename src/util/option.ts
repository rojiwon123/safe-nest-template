import { freezeObject } from "./fn";
import { Result } from "./result";

const kind = Symbol("Option");
const SomeSymbol = Symbol("Some");
const NoneSymbol = Symbol("None");

export interface Option<T> {
    readonly [kind]: typeof SomeSymbol | typeof NoneSymbol;
    readonly map: <R>(f: (input: T) => R) => Option<R>;
    readonly flatMap: <R>(f: (input: T) => Option<R>) => Option<R>;
    readonly match: <R1, R2>(fn1: (input: T) => R1, fn2: () => R2) => R1 | R2;
    readonly toResult: <E>(err: E) => Result<T, E>;
    readonly async: {
        readonly [kind]: typeof SomeSymbol | typeof NoneSymbol;
        readonly map: <R>(f: (input: T) => Promise<R>) => Promise<Option<R>>;
        readonly flatMap: <R>(f: (input: T) => Promise<Option<R>>) => Promise<Option<R>>;
    };
}

export namespace Option {
    export const Some = <T>(input: T): Option<T> =>
        freezeObject({
            [kind]: SomeSymbol,
            map: (f) => Some(f(input)),
            flatMap: (f) => f(input),
            match: (fn) => fn(input),
            toResult: <E>() => Result.Ok<T, E>(input),
            async: freezeObject({
                [kind]: SomeSymbol,
                map: async (f) => Some(await f(input)),
                flatMap: async (f) => f(input),
            }),
        });
    export const None = <T>(): Option<T> =>
        freezeObject({
            [kind]: NoneSymbol,
            map: () => None(),
            flatMap: () => None(),
            match: (_, fn) => fn(),
            toResult: <E>(e: E) => Result.Err<T, E>(e),
            async: freezeObject({
                [kind]: NoneSymbol,
                map: async <T>() => None<T>(),
                flatMap: async <T>() => None<T>(),
            }),
        });
    export const unit = <T>(input: T | null | undefined): Option<NonNullable<T>> =>
        input === null || input === undefined ? Option.None() : Option.Some(input);
}
