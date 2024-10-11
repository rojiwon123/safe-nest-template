import { identity } from "@fxts/core";

import { freezeObject } from "./fn";
import { Option } from "./option";

const kind = Symbol("Once");

/** 함수를 한 번만 실행합니다. */
export interface Once<T> {
    readonly [kind]: typeof kind;
    readonly init: () => void;
    readonly run: () => T;
}

export namespace Once {
    export const unit = <T>(fn: () => T): Once<T> => {
        let option = Option.None<T>();
        return freezeObject({
            [kind]: kind,
            init: () => {
                option = Option.Some(option.match(identity, fn));
            },
            run: () => {
                const value = option.match(identity, fn);
                option = Option.Some(value);
                return value;
            },
        });
    };
}
