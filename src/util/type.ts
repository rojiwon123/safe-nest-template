import typia from "typia";

export type OmitKeyof<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Regex<T extends string> = string & typia.tags.Pattern<T>;
export namespace Regex {
    export type UUID = string & typia.tags.Format<"uuid">;
    export type RFC3339 = string & typia.tags.Format<"date-time">;
    export type URI = string & typia.tags.Format<"uri">;
    export type Email = string & typia.tags.Format<"email">;
}

export namespace Num {
    export type Int64 = number & typia.tags.Type<"int64">;
    export type UInt64 = number & typia.tags.Type<"uint64">;
    export type Double = number & typia.tags.Type<"double">;
}
