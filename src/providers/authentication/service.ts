import { pipe } from "@fxts/core";
import { IAuthentication } from "@APP/api/structures/authentication";
import { Oauth } from "@APP/externals/oauth";
import { Exception } from "./exception";
import { pick } from "@APP/utils";

export namespace Service {
    export const signIn = async (input: IAuthentication.ISignIn) => {
        try {
            return await pipe(
                input.code,

                Oauth.Kakao.getTokens,

                pick("access_token"),

                Oauth.Kakao.getMe,

                (response) => {
                    console.log(response);
                },
            );
        } catch {
            throw Exception.Unauthorized("Authentication Fail");
        }
    };

    export const getLoginUrl = { kakao: Oauth.Kakao.LoginUri };
}
