import { Regex } from "@/util/regex";

export interface User {
    id: Regex.UUID;
    name: string;
    email: Regex.Email;
    created_at: Regex.DateTime;
}

export namespace User {
    export interface Id {
        user_id: Regex.UUID;
    }
}
