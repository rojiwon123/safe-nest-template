import { Option } from "./option";

const kind = Symbol("Once");

export interface Once<T> {
    readonly [kind]: typeof kind;
    readonly init: () => void;
    readonly run: () => T;
}

export namespace Once {
    export const unit = <T>(fn: () => T): Once<T> => {
        let option = Option.None<T>();
        return Object.defineProperties(
            {
                [kind]: kind,
                init: () => {
                    option = Option.Some(option.match((val) => val, fn));
                },
                run: () => {
                    const value = option.match((val) => val, fn);
                    option = Option.Some(value);
                    return value;
                },
            },
            {
                [kind]: {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                },
                init: {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                },
                run: {
                    writable: false,
                    enumerable: false,
                    configurable: false,
                },
            },
        );
    };
}
