import { isNull } from "@fxts/core";

export const compare =
    (sort: "asc" | "desc") =>
    <T>(map: (input: T) => number) =>
    (a: T, b: T) =>
        sort === "desc" ? map(b) - map(a) : map(a) - map(b);

export namespace Entity {
    export const isDeleted = <T extends { deleted_at: Date | null }>(
        input: T,
    ): input is T & { deleted_at: Date } => isNull(input.deleted_at);

    export const exist = <T extends { deleted_at: Date | null }>(
        input: T | null,
    ): input is T & { deleted_at: null } => !isNull(input) && isDeleted(input);
}

export const pick =
    <T extends object, K extends keyof T>(key: K) =>
    (obj: T) =>
        obj[key];

export const toFixed =
    (digit = 0) =>
    (num: number): number =>
        +num.toFixed(digit);
