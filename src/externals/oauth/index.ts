import { IAuthentication } from "@APP/app/authentication";
import { ExternalFailure } from "@APP/utils/error";
import { Result } from "@APP/utils/result";

import { Github } from "./github";
import { Kakao } from "./kakao";

type Authorize = (code: string) => Promise<
    Result<
        {
            oauth_sub: string;
            name: string | null;
        },
        ExternalFailure<`Oauth[${IAuthentication.OuathType}].authorize`>
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
                    ExternalFailure.create({
                        at: "Oauth[kakao].authorize",
                        error,
                        input: { code },
                    }),
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
                    ExternalFailure.create({
                        at: "Oauth[github].authorize",
                        error,
                        input: { code },
                    }),
                );
            }
        },
    },
};
