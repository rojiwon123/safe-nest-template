import { isNumber, isString, isUndefined } from "@fxts/core";

import { freezeObject } from "./fn";
import { Regex } from "./type";

const kind = Symbol("DateTime");

export interface DateTime {
    readonly [kind]: typeof kind;
    readonly add: DateTime.Operator;
    readonly sub: DateTime.Operator;
    readonly toString: () => string;
    readonly toLcaleString: (input: { locales?: Intl.LocalesArgument; options?: Intl.DateTimeFormatOptions }) => string;
    readonly toTime: () => number;
    readonly compare: (input: DateTime | number | Regex.RFC3339 | Date) => number;
}

export namespace DateTime {
    export type OperatorInput = Partial<{ day: number; hour: number; minute: number; sec: number; ms: number }>;
    export type Operator = (input: OperatorInput) => DateTime;
    const sec = (s: number) => s * 1000;
    const minute = (m: number) => sec(m * 60);
    const hour = (h: number) => minute(h * 60);
    const day = (d: number) => hour(d * 24);
    export const unit = (date?: DateTime | Date | Regex.RFC3339 | number): DateTime => {
        const ms: number =
            isNumber(date) ? date
            : isString(date) ? new Date(date).getTime()
            : isUndefined(date) ? Date.now()
            : date instanceof Date ? date.getTime()
            : date.toTime();
        return freezeObject({
            [kind]: kind,
            add: (input) =>
                unit(
                    ms +
                        [input.ms ?? 0 + sec(input.sec ?? 0), minute(input.minute ?? 0), hour(input.hour ?? 0), day(input.day ?? 0)].reduce(
                            (a, b) => a + b,
                            0,
                        ),
                ),
            sub: (input) =>
                unit(
                    ms -
                        [input.ms ?? 0 + sec(input.sec ?? 0), minute(input.minute ?? 0), hour(input.hour ?? 0), day(input.day ?? 0)].reduce(
                            (a, b) => a + b,
                            0,
                        ),
                ),
            toString: () => new Date(ms).toISOString(),
            toLcaleString: (input) => new Date(ms).toLocaleString(input.locales, input.options),
            toTime: () => ms,
            compare: (input) => ms - unit(input).toTime(),
        });
    };
}
