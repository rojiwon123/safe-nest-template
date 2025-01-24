import { Effect, gen, succeed } from "effect/Effect";

import { AccessTokenPayload, RefreshTokenPayload, Token } from "@/app/auth/domain/auth.model";
import { IAuthService } from "@/app/auth/domain/auth.service.interface";
import { User } from "@/app/user/user.model";
import { Err } from "@/common/err";
import { createLayer } from "@/util/layer";

export class AuthService implements IAuthService {
    static readonly layer = createLayer(IAuthService.Tag, AuthService)(succeed([]));

    createCode(input: User.Id): Effect<IAuthService.Code> {
        return gen(function* () {
            input;
            return { code: "" };
        });
    }
    verifyCode(input: IAuthService.Code): Effect<IAuthService.CodeId, Err<Err.Body<"CODE_INVALID">> | Err<Err.Body<"CODE_EXPIRED">>> {
        return gen(function* () {
            input;
            return { code_id: "" };
        });
    }
    createAccessToken(input: User.Id): Effect<Token> {
        return gen(function* () {
            input;
            return { token: "", expired_at: "" };
        });
    }
    createRefreshToken(input: User.Id): Effect<Token> {
        return gen(function* () {
            input;
            return { token: "", expired_at: "" };
        });
    }
    parseAccessToken(input: {
        access_token: string;
    }): Effect<AccessTokenPayload, Err<Err.Body<"TOKEN_INVALID">> | Err<Err.Body<"TOKEN_EXPIRED">>> {
        return gen(function* () {
            input;
            return {
                user_id: "",
                created_at: "",
                expired_at: "",
            };
        });
    }
    parseRefreshToken(input: { refresh_token: string }): Effect<RefreshTokenPayload, Err<Err.Body<"TOKEN_INVALID">>> {
        return gen(function* () {
            input;
            return {
                refresh_token_id: "",
                salt: "",
                expired_at: "",
            };
        });
    }
    removeRefreshToken(input: RefreshTokenPayload): Effect<void> {
        return gen(function* () {
            input;
        });
    }
    extendRefreshToken(
        input: RefreshTokenPayload,
    ): Effect<IAuthService.ExtendRefreshTokenOutput, Err<Err.Body<"TOKEN_INVALID">> | Err<Err.Body<"TOKEN_EXPIRED">>> {
        return gen(function* () {
            input;
            return { user_id: "", refresh_token: { token: "", expired_at: "" } };
        });
    }
}
