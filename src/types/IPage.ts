import typia from "typia";

import { Num } from "./global";

export namespace IPage {
    export type SortType = "latest" | "oldest";
    export interface IPaginated<T> {
        data: T[];
        page: Num.UInt64;
        size: Num.UInt64 & typia.tags.Minimum<10>;
    }

    export interface ISearch {
        /** @default 0 */
        page?: Num.UInt64;
        /** @default 10 */
        size?: Num.UInt64 & typia.tags.Minimum<10>;
    }
}
