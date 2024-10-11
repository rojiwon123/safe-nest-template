import { Regex } from "@SRC/common/type";

export namespace IAuthentication {
    export interface ITokenPayload {
        type: "access";
        user_id: Regex.UUID;
        expired_at: Regex.DateTime;
    }
    export interface IToken {
        token: string;
        expired_at: Regex.DateTime;
    }
}
