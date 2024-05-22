import { isNumber, isString, isUndefined } from '@fxts/core';

import { Regex } from './type';

export namespace DateUtil {
    /**
     * number value in seconds since midnight, January 1, 1970 UTC.
     */
    export const toEpoch = (input?: Date | Regex.DateTime): number => {
        const date = isUndefined(input)
            ? new Date()
            : isString(input)
              ? new Date(input)
              : input;
        return Math.floor(date.getTime() / 1000);
    };

    /**
     * `RFC 3339` standard `date-time` format string
     */
    export const toDateTime = (input?: number | Date): Regex.DateTime => {
        const date = isUndefined(input)
            ? new Date()
            : isNumber(input)
              ? new Date(input * 1000)
              : input;
        return date.toISOString();
    };

    /**
     * JS Date Class Instance
     */
    export const to = (input?: number | Regex.DateTime): Date => {
        return isUndefined(input)
            ? new Date()
            : isString(input)
              ? new Date(input)
              : new Date(input * 1000);
    };

    export const sec = (sec: number, now?: Date): Date =>
        new Date((now ?? new Date()).getTime() + sec * 1000);
    export const minute = (minute: number, now?: Date): Date =>
        sec(minute * 60, now);
    export const hour = (hour: number, now?: Date): Date =>
        minute(hour * 60, now);
    export const day = (day: number, now?: Date): Date => hour(day * 24, now);

    /**
     * date1 - date2
     */
    export const compare = (date1: Date, date2: Date): number =>
        date1.getTime() - date2.getTime();

    export const isExpired = (input: Regex.DateTime | number | Date): boolean =>
        compare(to(), typeof input === 'object' ? input : to(input)) >= 0;
}
