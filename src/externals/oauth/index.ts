import { ErrorCode } from "@APP/types/ErrorCode";
import { IOauth } from "@APP/types/IOauth";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

import { GithubSDK } from "./github";
import { KakaoSDK } from "./kakao";

export namespace Oauth {
    export type GetUrl = () => string;
    export type GetProfile = (
        code: string,
    ) => Promise<
        Result<
            { oauth_sub: string; profile: IOauth.IProfile },
            Failure.Internal<ErrorCode.Authentication>
        >
    >;
    export namespace Kakao {
        const get_profile = (
            user: KakaoSDK.IGetUserResponse,
        ): IOauth.IProfile => {
            user;
            throw Error("Function is not Implemented.");
        };

        export const getUrlForLogin: GetUrl = () =>
            KakaoSDK.getUrlForAuthorize();

        export const getProfile: GetProfile = async (code) => {
            const response = await KakaoSDK.getToken(code);
            if (Result.Error.is(response)) return response;
            const access_token = Result.Ok.flatten(response).access_token;
            const user_result = await KakaoSDK.getUser({
                secure_resource: true,
                property_keys: [
                    "kakao_account.email",
                    "kakao_account.name",
                    "kakao_account.profile",
                ],
            })(access_token);
            if (Result.Error.is(user_result)) return user_result;
            const user = Result.Ok.flatten(user_result);
            return Result.Ok.map({
                oauth_sub: user.id + "",
                profile: get_profile(user),
            });
        };
    }

    export namespace Github {
        const get_profile = (user: GithubSDK.IUser): IOauth.IProfile => {
            user;
            throw Error("Function is not Implemented.");
        };

        export const getUrlForLogin: GetUrl = () =>
            GithubSDK.getUrlForAuthorize();

        export const getProfile: GetProfile = async (code) => {
            const response = await GithubSDK.getAccessToken(code);
            if (Result.Error.is(response)) return response;
            const access_token = Result.Ok.flatten(response);
            const user_result = await GithubSDK.getUser(access_token);
            if (Result.Error.is(user_result)) return user_result;
            const user = Result.Ok.flatten(user_result);
            return Result.Ok.map({
                oauth_sub: user.id + "",
                profile: get_profile(user),
            });
        };
    }
}
