import { pipe } from "@fxts/core";

import { Oauth } from "@APP/externals/oauth";
import { IAuthentication } from "@APP/types/dto/IAuthentication";
import { IToken } from "@APP/types/dto/IToken";
import { assertModule } from "@APP/utils/fx";

assertModule<Authentication>(Authentication);

export interface Authentication {
    readonly getLoginUrl: (
        oauth_type: IAuthentication.OauthType,
    ) => Promise<string>;

    readonly signIn: (
        input: Authentication.IOauthInput,
    ) => Promise<Authentication.IOauthOutput>;

    readonly signUp: (
        input: Authentication.IOauthInput,
    ) => Promise<Authentication.IOauthOutput>;

    readonly refreshAccessToken: (
        input: Authentication.IRefreshAccessTokenInput,
    ) => Promise<Authentication.IRefreshAccessTokenOutput>;
}

export namespace Authentication {
    export interface IOauthInput {
        oauth_type: IAuthentication.OauthType;
        code: string;
    }

    export interface IOauthOutput {
        access_token: IToken.IResponse<"access">;
        refresh_token: IToken.IResponse<"refresh">;
    }

    export type IRefreshAccessTokenInput = number;
    export type IRefreshAccessTokenOutput = number;

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

    export const signIn: Authentication["signIn"] = (input) =>
        pipe(
            input,

            getProfile,
        );

    export const signUp: Authentication["signUp"] = () => {};

    export const refreshAccessToken: Authentication["refreshAccessToken"] =
        () => {};
}
