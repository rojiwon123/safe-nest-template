import { identity } from "@fxts/core";

import { freeze } from "./fn";
import { Option } from "./option";

const kind = Symbol("Once");

export interface Once<T> {
    readonly [kind]: typeof kind;
    /** get과 동일하나 그 결과를 반환하지 않는다. */
    readonly init: () => void;
    /** 함수를 실행하고 그 결과를 반환한다. */
    readonly get: () => T;
    readonly map: <R>(f: (x: T) => R) => R;
}

export namespace Once {
    export const of = <T>(f: () => T): Once<T> => {
        let value: Option<T> = Option.None();
        const get = () => {
            const j = Option.match(identity, f)(value);
            value = Option.Some(j);
            return j;
        };
        return freeze({
            [kind]: kind,
            init: () => {
                get();
            },
            get,
            map: (f) => f(get()),
        });
    };
}
