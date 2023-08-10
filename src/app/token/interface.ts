import { ErrorCode } from "@APP/types/ErrorCode";
import { ExternalFailure, InternalFailure } from "@APP/utils/error";
import { Result } from "@APP/utils/result";

import { IUser } from "../user";

export interface ITokenService<T extends IToken.IBase> {
    readonly generate: (
        paylaod: IToken.ICreate<T>,
    ) => Result<IToken, ExternalFailure<"Crypto.encrypt">>;
    readonly verify: (
        token: string,
    ) => Result<
        T,
        ExternalFailure<"Crypto.decrypt"> | InternalFailure<ErrorCode.Token>
    >;
}

/**
 * 보안 토큰 정보
 */
export interface IToken {
    readonly token: string;
    /**
     * 토큰 만료일자
     *
     * @format date-time
     */
    readonly expired_at: string;
}

export namespace IToken {
    export type Type = "account" | "access" | "refresh";
    export interface IBase<T extends IToken.Type = IToken.Type> {
        readonly type: T;
        /** @format date-time */
        readonly expired_at: string;
    }
    export interface IAccount extends IBase<"account"> {
        readonly account_id: string;
    }
    export interface IAccess extends IBase<"access"> {
        readonly user_id: string;
        readonly user_type: IUser.Type;
    }
    export interface IRefresh extends IBase<"refresh"> {
        readonly user_id: string;
        readonly user_type: IUser.Type;
    }
    export type ICreate<T extends IBase> = Omit<T, "type" | "expired_at">;
}
