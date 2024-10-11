import typia from "typia";

import { Num } from "./type";

export namespace Page {
    export interface Search {
        size?: Num.Int64 & typia.tags.Minimum<1> & typia.tags.Maximum<1000>;
    }
    export interface Paginated<T> {
        list: T[];
    }
}
