import typia from "typia";

export namespace Num {
    export type Int64 = number & typia.tags.Type<"int64">;
    export type UInt64 = number & typia.tags.Type<"uint64">;
    export type Double = number & typia.tags.Type<"double">;
}
