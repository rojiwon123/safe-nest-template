import { Regex } from "@/util/regex";

export namespace User {
    export interface Id {
        user_id: Regex.UUID;
    }
}
