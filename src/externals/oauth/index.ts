import { IAuthentication } from "@APP/api/structures/IAuthentication";
import { ExternalFailure, Result } from "@APP/utils";

import { Github } from "./github";
import { Kakao } from "./kakao";

type Authorize = (code: string) => Promise<
    Result<
        {
            oauth_sub: string;
            name: string | null;
        },
        ExternalFailure<"OAUTH_FAIL">
    >
>;

export type Oauth = {
    [key in IAuthentication.OuathType]: {
        loginUri: string;
        authorize: Authorize;
    };
};

export const Oauth: {
    readonly [key in IAuthentication.OuathType]: {
        loginUri: string;
        authorize: Authorize;
    };
} = {
    kakao: {
        loginUri: Kakao.LoginUri,
        async authorize(code) {
            try {
                const { access_token } = await Kakao.getTokens(code);
                const me = await Kakao.getMe(access_token);
                const oauth_sub = me.id + "";
                const name = me.kakao_account?.name ?? null;
                return Result.Ok.map({ oauth_sub, name });
            } catch (error) {
                return Result.Error.map(
                    ExternalFailure.get("OAUTH_FAIL", error),
                );
            }
        },
    },
    github: {
        loginUri: Github.LoginUri,
        async authorize(code) {
            try {
                const tokens = await Github.getTokens(code);
                const { access_token } = tokens;
                const user = await Github.getUser(access_token);
                const oauth_sub = user.id + "";
                const name = user.name;
                return Result.Ok.map({ oauth_sub, name });
            } catch (error) {
                return Result.Error.map(
                    ExternalFailure.get("OAUTH_FAIL", error),
                );
            }
        },
    },
};
