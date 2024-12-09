import { Option } from "effect";

const kind = Symbol("Once");

export interface Once<T> {
    readonly [kind]: typeof kind;
    readonly get: () => T;
}

export namespace Once {
    export const make = <T>(f: () => T): Once<T> => {
        let value: Option.Option<T> = Option.none();
        return {
            [kind]: kind,
            get: () => {
                const some = Option.match(value, { onSome: (i) => i, onNone: f });
                value = Option.some(some);
                return some;
            },
        };
    };
}
