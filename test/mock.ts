import { mock } from "node:test";

import { Oauth } from "@APP/externals/oauth";
import { Result } from "@APP/utils/result";

export const mock_function = () => {
    mock.method(Oauth.kakao, "authorize").mock.mockImplementation((async (
        code,
    ) => {
        return Result.Ok.map({ oauth_sub: code, name: "" });
    }) satisfies (typeof Oauth)["kakao"]["authorize"]);
    mock.method(Oauth.github, "authorize").mock.mockImplementation((async (
        code,
    ) => {
        return Result.Ok.map({ oauth_sub: code, name: "" });
    }) satisfies (typeof Oauth)["github"]["authorize"]);
};
