import typia from "typia";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Mutable<T extends object> = {
    -readonly [key in keyof T]: T[key];
};

export type PrismaReturn<T extends (...args: any[]) => any> = NonNullable<
    Awaited<ReturnType<T>>
>;

export namespace Regex {
    export type UUID = string & typia.tags.Format<"uuid">;
    export type DateTime = string & typia.tags.Format<"date-time">;
    export type URL = string & typia.tags.Format<"url">;
    export type Email = string & typia.tags.Format<"email">;
}

export namespace Num {
    export type Int64 = number & typia.tags.Type<"int64">;
    export type UInt64 = number & typia.tags.Type<"uint64">;
    export type Double = number & typia.tags.Type<"double">;
}
