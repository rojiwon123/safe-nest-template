import { Err } from "@/common/err";

export namespace AuthErr {
    interface Base<T extends string> extends Err.Body<`AUTH_${T}`> {}

    export interface UserCodeInvalid extends Base<"USER_CODE_INVALID"> {}
    export interface MFAFail extends Base<"MFA_FAIL"> {}
    export interface NotUser extends Base<"NOT_USER"> {}
    export interface AlreadyUser extends Base<"ALREADY_USER"> {}

    export interface TokenExpired extends Base<"TOKEN_EXPIRED"> {}
    export interface TokenInvalid extends Base<"TOKEN_INVALID"> {}
    export interface TokenRequired extends Base<"TOKEN_REQUIRED"> {}
}
