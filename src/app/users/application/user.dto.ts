import { Regex } from "@SRC/util/type";

export namespace UserDTO {
    export interface Profile {
        id: Regex.UUID;
        avatar_url: Regex.URI | null;
        name: string;
        created_at: Regex.RFC3339;
        updated_at: Regex.RFC3339 | null;
    }
}
