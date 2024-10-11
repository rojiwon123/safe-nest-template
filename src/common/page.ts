import typia from "typia";

import { Num } from "./type";

export namespace IPage {
    export type SortType = "latest" | "oldest";
    export interface IPaginated<T> {
        data: T[];
        page: Num.Int64;
        size: Num.Int64;
    }

    export interface ISearch {
        /** @default 1 */
        page?: Num.Int64 & typia.tags.Minimum<1>;
        /** @default 10 */
        size?: Num.Int64 & typia.tags.Minimum<10> & typia.tags.Maximum<50>;
    }
}
