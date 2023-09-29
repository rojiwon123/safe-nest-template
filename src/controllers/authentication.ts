import core from "@nestia/core";
import * as nest from "@nestjs/common";
import typia from "typia";

import { Authentication } from "@APP/app/authentication";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IAuthentication } from "@APP/types/IAuthentication";
import { IUser } from "@APP/types/IUser";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

@nest.Controller("auth")
export class AuthenticationController {
    @core.TypedRoute.Get("")
    async test(): Promise<IUser.IResponse> {
        return typia.random<IUser.IResponse>();
    }

    @core.TypedRoute.Get("user")
    test2(): Promise<IUser> {
        throw Error("");
    }

    /**
     * oauth 로그인 페이지 리다이렉트 주소
     *
     * @summary oauth 로그인 페이지 리다이렉트 주소
     * @tag auth
     * @param query oauth 유형을 전달해야 합니다.
     * @return url 주소
     */
    @core.TypedRoute.Get("oauth/url")
    getUrl(
        @core.TypedQuery() query: IAuthentication.IOauthType,
    ): Promise<IAuthentication.IUrl> {
        return Authentication.getOauthLoginUrl(query.oauth);
    }

    /**
     * oauth 인증 기반의 로그인
     *
     * @summary oauth 로그인
     * @tag auth
     * @param body oauth 유형과 code 정보를 전달합니다.
     * @return 권한 토큰
     */
    @core.TypedException<ErrorCode.Authentication>(
        nest.HttpStatus.UNAUTHORIZED,
        "인증 실패",
    )
    @core.TypedException<ErrorCode.User.NotFound>(
        nest.HttpStatus.FORBIDDEN,
        "로그인 실패 사유",
    )
    @nest.HttpCode(nest.HttpStatus.OK)
    @core.TypedRoute.Post("oauth/sign-in")
    async oauthSignIn(
        @core.TypedBody() body: IAuthentication.IOauthRequest,
    ): Promise<IAuthentication.ISignInResponse> {
        const result = await Authentication.oauthSignIn(body);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        if (error instanceof Failure.Internal)
            switch (error.message) {
                case "AUTHENTICATION_FAIL":
                    throw new Failure.Http(
                        error.message,
                        nest.HttpStatus.UNAUTHORIZED,
                    );
                case "NOT_FOUND_USER":
                    throw new Failure.Http(
                        error.message,
                        nest.HttpStatus.NOT_FOUND,
                    );
            }
        throw Failure.Http.fromExternal(error);
    }

    /**
     * oauth 인증 기반의 회원가입
     *
     * @summary oauth 회원가입
     * @tag auth
     * @param body oauth 유형과 code 정보를 전달합니다.
     * @return 권한 토큰
     */
    @core.TypedException<"AUTHENTICATION_FAIL">(
        nest.HttpStatus.UNAUTHORIZED,
        "인증 실패",
    )
    @core.TypedException<ErrorCode.User.AlreadyExist>(
        nest.HttpStatus.FORBIDDEN,
        "로그인 실패 사유",
    )
    @core.TypedRoute.Post("oauth/sign-up")
    async oauthSignUp(
        @core.TypedBody() body: IAuthentication.IOauthRequest,
    ): Promise<IAuthentication.ISignInResponse> {
        const result = await Authentication.oauthSignUp(body);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        if (error instanceof Failure.Internal)
            switch (error.message) {
                case "AUTHENTICATION_FAIL":
                    throw new Failure.Http(
                        error.message,
                        nest.HttpStatus.UNAUTHORIZED,
                    );
                case "ALREADY_EXIST_USER":
                    throw new Failure.Http(
                        error.message,
                        nest.HttpStatus.FORBIDDEN,
                    );
            }
        throw Failure.Http.fromExternal(error);
    }

    /**
     * 토큰 재발급 요청
     *
     * 만약 재발급 토큰의 만료기한이 얼마 안남았다면 재발급 토큰도 새롭게 생성하여 전달합니다.
     *
     * @summary 토큰 재발급
     * @tag auth
     * @param body 유효한 재발급 토큰
     * @return 권한 토큰
     */
    @core.TypedException<ErrorCode.Token>(
        nest.HttpStatus.FORBIDDEN,
        "토큰 인증 거부사유",
    )
    @core.TypedRoute.Post("token/refresh")
    async refresh(
        @core.TypedBody() body: IAuthentication.IRefreshRequest,
    ): Promise<IAuthentication.IRefreshResponse> {
        const result = await Authentication.refreshToken(body);
        if (Result.Ok.is(result)) return Result.Ok.flatten(result);
        const error = Result.Error.flatten(result);
        if (error instanceof Failure.Internal)
            throw new Failure.Http(error.message, nest.HttpStatus.FORBIDDEN);
        throw Failure.Http.fromExternal(error);
    }
}
