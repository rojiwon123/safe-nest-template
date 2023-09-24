import { Format } from "typia/lib/tags";

import { Failure } from "@APP/utils/failure";
import { assertModule } from "@APP/utils/fx";
import { Result } from "@APP/utils/result";

import { GithubSDK } from "./github";
import { KakaoSDK } from "./kakao";

assertModule<Oauth>(Oauth.Kakao);
assertModule<Oauth>(Oauth.Github);

export interface Oauth {
    readonly getUrlForLogin: () => string;
    readonly getProfile: (
        code: string,
    ) => Promise<
        Result<
            { oauth_sub: string; profile: Oauth.IProfile },
            Failure.Internal<`Fail To Get ${string}`>
        >
    >;
}

export namespace Oauth {
    /**
     * 외부 서비스로부터 얻은 사용자 프로필 정보
     *
     * 해당 정보를 기반으로 사용자 프로필을 생성한다.
     */
    export interface IProfile {
        /** 사용자명 */
        name: string;
        /** 인증된 이메일 */
        email: (string & Format<"email">) | null;
        /** 프로필 이미지 */
        image_url: (string & Format<"url">) | null;
    }

    export namespace Kakao {
        const get_profile = (user: KakaoSDK.IGetUserResponse): IProfile => {
            user;
            throw Error("Function is not Implemented.");
        };

        export const getUrlForLogin: Oauth["getUrlForLogin"] = () =>
            KakaoSDK.getUrlForAuthorize();

        export const getProfile: Oauth["getProfile"] = async (code) => {
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
        const get_profile = (user: GithubSDK.IUser): IProfile => {
            user;
            throw Error("Function is not Implemented.");
        };

        export const getUrlForLogin: Oauth["getUrlForLogin"] = () =>
            GithubSDK.getUrlForAuthorize();

        export const getProfile: Oauth["getProfile"] = async (code) => {
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
