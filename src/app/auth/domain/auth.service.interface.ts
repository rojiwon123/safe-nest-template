import { Context, Effect } from "effect";

import { User } from "@/app/user/user.model";
import { Err } from "@/common/err";
import { Regex } from "@/util/regex";

import { AccessTokenPayload, RefreshTokenPayload, Token } from "./auth.model";

export interface IAuthService {
    /**
     * 사용자가 인증을 완료하면 인가 코드를 발급할 수 있는 code를 얻는다.
     *
     * code는 일회성이며 만료 주기가 짧다.
     */
    createCode: (input: User.Id) => Effect.Effect<IAuthService.Code>;
    verifyCode: (
        input: IAuthService.Code,
    ) => Effect.Effect<IAuthService.CodeId, Err<Err.Body<"CODE_INVALID">> | Err<Err.Body<"CODE_EXPIRED">>>;

    createAccessToken: (input: User.Id) => Effect.Effect<Token>;
    createRefreshToken: (input: User.Id) => Effect.Effect<Token>;
    parseAccessToken: (input: {
        access_token: string;
    }) => Effect.Effect<AccessTokenPayload, Err<Err.Body<"TOKEN_INVALID">> | Err<Err.Body<"TOKEN_EXPIRED">>>;
    parseRefreshToken: (input: { refresh_token: string }) => Effect.Effect<RefreshTokenPayload, Err<Err.Body<"TOKEN_INVALID">>>;

    removeRefreshToken: (input: RefreshTokenPayload) => Effect.Effect<void>;
    extendRefreshToken: (
        input: RefreshTokenPayload,
    ) => Effect.Effect<IAuthService.ExtendRefreshTokenOutput, Err<Err.Body<"TOKEN_INVALID">> | Err<Err.Body<"TOKEN_EXPIRED">>>;
}

export namespace IAuthService {
    export class Tag extends Context.Tag("AuthService")<Tag, IAuthService>() {}

    export interface Code {
        code: string;
    }

    export interface CodeId {
        code_id: Regex.UUID;
    }

    export interface ExtendRefreshTokenOutput extends User.Id {
        refresh_token: Token;
    }
}
