import { isNumber, isString, isUndefined } from "@fxts/core";

import { freeze } from "./fn";
import { Regex } from "./type";

const kind = Symbol("DateTime");

export interface DateTime {
    readonly [kind]: typeof kind;
    readonly add: DateTime.Operator;
    readonly sub: DateTime.Operator;
    readonly toTime: () => number;
    readonly toString: () => Regex.DateTime;
    readonly toJSON: () => Regex.DateTime;
    /** DateTiem - ipnut */
    readonly duration: (end: DateTime) => number;
    readonly toLocaleString: (input: { locales?: Intl.LocalesArgument; options?: Intl.DateTimeFormatOptions }) => string;
}
export namespace DateTime {
    export type OperatorInput = Partial<{ day: number; hour: number; minute: number; sec: number; ms: number }>;
    export type Operator = (input: OperatorInput) => DateTime;
    /** sec to ms */
    type toMS = (input: number) => number;
    const sec: toMS = (sec) => sec * 1000;
    const minute: toMS = (min) => sec(min * 60);
    const hour: toMS = (hour) => minute(hour * 60);
    const day: toMS = (day) => hour(day * 24);
    export const of = (date?: Date | Regex.DateTime | number): DateTime => {
        const ms: number =
            isNumber(date) ? date
            : isString(date) ? new Date(date).getTime()
            : isUndefined(date) ? Date.now()
            : date.getTime();
        return freeze({
            [kind]: kind,
            add: (input) =>
                of(
                    ms +
                        [input.ms ?? 0, sec(input.sec ?? 0), minute(input.minute ?? 0), hour(input.hour ?? 0), day(input.day ?? 0)].reduce(
                            (a, b) => a + b,
                            0,
                        ),
                ),
            sub: (input) =>
                of(
                    ms -
                        [input.ms ?? 0, sec(input.sec ?? 0), minute(input.minute ?? 0), hour(input.hour ?? 0), day(input.day ?? 0)].reduce(
                            (a, b) => a + b,
                            0,
                        ),
                ),
            toString: () => new Date(ms).toISOString(),
            toJSON: () => new Date(ms).toISOString(),
            toTime: () => ms,
            toLocaleString: (input) => new Date(ms).toLocaleString(input.locales, input.options),
            duration: (input) => ms - input.toTime(),
        });
    };

    // export const isExpired = (input: DateTime): boolean => DateTime.of().compare(input) > 0;
}
