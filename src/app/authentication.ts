import { isNull, negate, pipe, unless } from "@fxts/core";

import { Oauth } from "@APP/externals/oauth";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IAuthentication } from "@APP/types/IAuthentication";
import { IOauth } from "@APP/types/IOauth";
import { Failure } from "@APP/utils/failure";
import { assertModule } from "@APP/utils/fx";
import { Random } from "@APP/utils/random";
import { Result } from "@APP/utils/result";

import { Token } from "./token";
import { User } from "./user";

export interface Authentication {
    readonly getOauthLoginUrl: (
        oauth_type: IOauth.Type,
    ) => Promise<IAuthentication.IUrl>;

    readonly oauthSignIn: (
        input: IAuthentication.IOauthRequest,
    ) => Promise<
        Result<
            IAuthentication.ISignInResponse,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<
                  ErrorCode.Authentication | ErrorCode.User.NotFound
              >
        >
    >;

    readonly oauthSignUp: (
        input: IAuthentication.IOauthRequest,
    ) => Promise<
        Result<
            IAuthentication.ISignInResponse,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<
                  ErrorCode.Authentication | ErrorCode.User.AlreadyExist
              >
        >
    >;

    readonly refreshToken: (
        input: IAuthentication.IRefreshRequest,
    ) => Promise<
        Result<
            IAuthentication.IRefreshResponse,
            | Failure.External<"Crypto.encrypt">
            | Failure.Internal<ErrorCode.Token>
        >
    >;
}

export namespace Authentication {
    export const getOauthLoginUrl: Authentication["getOauthLoginUrl"] = async (
        oauth_type,
    ): Promise<IAuthentication.IUrl> => {
        switch (oauth_type) {
            case "kakao":
                return { url: Oauth.Kakao.getUrlForLogin() };
            case "github":
                return { url: Oauth.Github.getUrlForLogin() };
        }
    };

    const getProfile = async (input: IAuthentication.IOauthRequest) => {
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
    export const oauthSignIn: Authentication["oauthSignIn"] = (input) =>
        pipe(
            input,

            getProfile,

            unless(
                Result.Ok.is,
                Result.Error.lift(
                    () =>
                        new Failure.Internal<ErrorCode.Authentication>(
                            "AUTHENTICATION_FAIL",
                        ),
                ),
            ),

            unless(Result.Error.is, async (ok) => {
                const { oauth_sub } = Result.Ok.flatten(ok);

                // oauth_sub 기반으로 사용자 인증 정보 검색
                const user_id: string | null = oauth_sub;
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

    export const oauthSignUp: Authentication["oauthSignUp"] = (input) =>
        pipe(
            input,

            getProfile,

            unless(
                Result.Ok.is,
                Result.Error.lift(
                    () =>
                        new Failure.Internal<ErrorCode.Authentication>(
                            "AUTHENTICATION_FAIL",
                        ),
                ),
            ),

            unless(Result.Error.is, async (ok) => {
                const { oauth_sub, profile } = Result.Ok.flatten(ok);

                // oauth_sub 기반으로 사용자 인증 정보 검색
                const user_id: string | null = oauth_sub;
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

    export const refreshToken: Authentication["refreshToken"] = (input) => {
        input;
        throw Error("");
    };
}

assertModule<Authentication>(Authentication);
