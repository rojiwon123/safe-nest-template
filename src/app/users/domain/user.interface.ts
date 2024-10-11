import { Regex } from "@SRC/util/type";

export namespace User {
    export interface Id {
        user_id: Regex.UUID;
    }
}
