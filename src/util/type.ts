import typia from "typia";

export type OmitKeyof<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Mutable<T extends object> = {
    -readonly [key in keyof T]: T[key];
};

export type Mandatory<T extends object> = Required<{
    [key in keyof T]: NonNullable<T[key]>;
}>;

export type Nullable<T extends object> = {
    [key in keyof T]: T[key] | null;
};

export type Extract<T, U extends T> = T extends U ? T : never;
export type Exclude<T, U extends T> = T extends U ? never : T;

export namespace Regex {
    export type UUID = string & typia.tags.Format<"uuid">;
    export type DateTime = string & typia.tags.Format<"date-time">;
    export type URI = string & typia.tags.Format<"uri">;
    export type Email = string & typia.tags.Format<"email">;
}

export namespace Num {
    export type Int64 = number & typia.tags.Type<"int64">;
    export type UInt64 = number & typia.tags.Type<"uint64">;
    export type Double = number & typia.tags.Type<"double">;
}
