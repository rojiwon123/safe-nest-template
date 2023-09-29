// import { mock } from "node:test";
import typia from "typia";

import { Oauth } from "@APP/externals/oauth";
import { IOauth } from "@APP/types/IOauth";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace Mock {
    const method =
        <T extends object, M extends keyof T>(module: T, methodName: M) =>
        (fn: T[M]): void => {
            module[methodName] = fn;
        };

    export const run = () => {
        method(
            Oauth.Kakao,
            "getUrlForLogin",
        )(() => "http://localhost:4000/login");
        method(
            Oauth.Github,
            "getUrlForLogin",
        )(() => "http://localhost:4000/login");
        method(
            Oauth.Github,
            "getProfile",
        )(async (code) => {
            if (code === "test_fail")
                return Result.Error.map(
                    new Failure.Internal("Fail To Get Data"),
                );
            return Result.Ok.map({
                oauth_sub: code,
                profile: typia.random<IOauth.IProfile>(),
            });
        });
        method(
            Oauth.Kakao,
            "getProfile",
        )(async (code) => {
            if (code === "test_fail")
                return Result.Error.map(
                    new Failure.Internal("Fail To Get Data"),
                );
            return Result.Ok.map({
                oauth_sub: code,
                profile: typia.random<IOauth.IProfile>(),
            });
        });
    };
}
