import { Regex } from "@/util/regex";

export interface Token {
    token: string;
    expired_at: Regex.DateTime;
}

export interface AccessTokenPayload {
    user_id: Regex.UUID;
    created_at: Regex.DateTime;
    expired_at: Regex.DateTime;
}

export interface RefreshTokenPayload {
    refresh_token_id: Regex.UUID;
    salt: string;
    expired_at: Regex.DateTime;
}
