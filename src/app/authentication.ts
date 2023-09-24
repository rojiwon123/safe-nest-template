import { isNull, negate, pipe, unless } from "@fxts/core";

import { Oauth } from "@APP/externals/oauth";
import { ErrorCode } from "@APP/types/dto/ErrorCode";
import { IOauth } from "@APP/types/dto/IOauth";
import { IToken } from "@APP/types/dto/IToken";
import { Failure } from "@APP/utils/failure";
import { assertModule } from "@APP/utils/fx";
import { Random } from "@APP/utils/random";
import { Result } from "@APP/utils/result";

import { Token } from "./token";
import { User } from "./user";

export interface Authentication {
    readonly getLoginUrl: (oauth_type: IOauth.Type) => Promise<string>;

    readonly signIn: (
        input: Authentication.IOauthInput,
    ) => Promise<
        Result<
            Authentication.IAuthenticationOutput,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<
                  `Fail To Get ${string}` | ErrorCode.User.NotFound
              >
        >
    >;

    readonly signUp: (
        input: Authentication.IOauthInput,
    ) => Promise<
        Result<
            Authentication.IAuthenticationOutput,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<
                  `Fail To Get ${string}` | ErrorCode.User.AlreadyExist
              >
        >
    >;

    readonly refreshAccessToken: (
        input: Authentication.IRefreshAccessTokenInput,
    ) => Promise<
        Result<
            Authentication.IRefreshAccessTokenOutput,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<ErrorCode.Token.Expired>
        >
    >;
}

export namespace Authentication {
    export interface IOauthInput {
        oauth_type: IOauth.Type;
        code: string;
    }

    export interface IAuthenticationOutput {
        access_token: IToken.IResponse<"access">;
        refresh_token: IToken.IResponse<"refresh">;
    }

    export interface IRefreshAccessTokenInput {
        refresh_token: string;
    }
    export interface IRefreshAccessTokenOutput {
        /** 새로 발급된 액세스 토큰 */
        access_token: IToken.IResponse<"access">;
        /**
         * 만약 리프레시 토큰의 만료일이 얼마 안남은 경우, 리프레스 토큰가 응답 데이터에 추가된다.
         */
        refresh_token?: IToken.IResponse<"refresh">;
    }

    export const getLoginUrl: Authentication["getLoginUrl"] = async (
        oauth_type,
    ) => {
        switch (oauth_type) {
            case "kakao":
                return Oauth.Kakao.getUrlForLogin();
            case "github":
                return Oauth.Github.getUrlForLogin();
        }
    };

    const getProfile = (input: IOauthInput) => {
        switch (input.oauth_type) {
            case "kakao":
                return Oauth.Kakao.getProfile(input.code);
            case "github":
                return Oauth.Github.getProfile(input.code);
        }
    };

    const createSession = async (user_id: string) => {
        user_id;
        // user_id, session_id를 기반으로 세션 생성
        return Random.string(10);
    };

    /**
     * 로그인 요청
     */
    export const signIn: Authentication["signIn"] = (input) =>
        pipe(
            input,

            getProfile,

            unless(Result.Error.is, async (ok) => {
                const {} = Result.Ok.flatten(ok);

                // oauth_sub 기반으로 사용자 인증 정보 검색
                const user_id: string | null = {} as any;
                if (isNull(user_id))
                    return Result.Error.map(
                        new Failure.Internal<ErrorCode.User.NotFound>(
                            "NOT_FOUND_USER",
                        ),
                    );
                const access_token_result = Token.generateAccess({ user_id });
                const refresh_token_result = Token.generateRefresh({
                    user_id,
                    id: await createSession(user_id),
                });
                if (Result.Error.is(access_token_result))
                    return access_token_result;
                if (Result.Error.is(refresh_token_result))
                    return refresh_token_result;
                return Result.Ok.map({
                    access_token: Result.Ok.flatten(access_token_result),
                    refresh_token: Result.Ok.flatten(refresh_token_result),
                });
            }),
        );

    export const signUp: Authentication["signUp"] = (input) =>
        pipe(
            input,

            getProfile,

            unless(Result.Error.is, async (ok) => {
                const { profile } = Result.Ok.flatten(ok);

                // oauth_sub 기반으로 사용자 인증 정보 검색
                const user_id: string | null = {} as any;
                if (negate(isNull)(user_id))
                    return Result.Error.map(
                        new Failure.Internal<ErrorCode.User.AlreadyExist>(
                            "ALREADY_EXIST_USER",
                        ),
                    );
                const user = await User.create(profile);
                const access_token_result = Token.generateAccess({
                    user_id: user.id,
                });
                const refresh_token_result = Token.generateRefresh({
                    user_id: user.id,
                    id: await createSession(user.id),
                });
                if (Result.Error.is(access_token_result))
                    return access_token_result;
                if (Result.Error.is(refresh_token_result))
                    return refresh_token_result;
                return Result.Ok.map({
                    access_token: Result.Ok.flatten(access_token_result),
                    refresh_token: Result.Ok.flatten(refresh_token_result),
                });
            }),
        );

    export const refreshAccessToken: Authentication["refreshAccessToken"] = (
        input,
    ) => {
        input;
        throw Error("");
    };
}

assertModule<Authentication>(Authentication);
