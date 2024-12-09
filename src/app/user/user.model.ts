import { Regex } from "@/common/type";

export namespace User {
    export interface Id {
        user_id: Regex.UUID;
    }
}
