import typia from "typia";

export namespace IPage {
    export type SortType = "latest" | "oldest";
    export interface IPaginated<T> {
        data: T[];
        page: number & typia.tags.Type<"uint64">;
        size: number & typia.tags.Type<"uint64"> & typia.tags.Minimum<10>;
    }

    export interface ISearch {
        /** @default 0 */
        page?: number & typia.tags.Type<"uint64">;
        /** @default 10 */
        size?: number & typia.tags.Type<"uint64"> & typia.tags.Minimum<10>;
    }
}
