import typia from "typia";

export namespace Regex {
    export type UUID = string & typia.tags.Format<"uuid">;
    export type DateTime = string & typia.tags.Format<"date-time">;
    export type URI = string & typia.tags.Format<"uri">;
    export type Email = string & typia.tags.Format<"email">;
}
