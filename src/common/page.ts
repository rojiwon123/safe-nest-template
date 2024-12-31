import typia from "typia";

import { Num, Regex } from "@/util/type";

export namespace Page {
    export interface Paginated<T> {
        list: T[];
        next: boolean;
    }

    export interface Search {
        last_id?: Regex.UUID;
        size?: Num.Int64 & typia.tags.Minimum<1> & typia.tags.Maximum<100>;
    }
}
