import typia from "typia";

import { Num, Regex } from "./type";

export namespace IPage {
    export interface IPaginated<T> {
        list: T[];
        next: boolean;
    }

    export interface ISearch {
        last_id?: Regex.UUID;
        size?: Num.Int64 & typia.tags.Minimum<1> & typia.tags.Maximum<100>;
    }
}
