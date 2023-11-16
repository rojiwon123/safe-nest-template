import { mock } from "node:test";
import typia from "typia";

import { Oauth } from "@APP/externals/oauth";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IOauth } from "@APP/types/IOauth";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace Mocker {
    type MethodNames<T extends object> = {
        [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
    }[keyof T];
    export const implement = <T extends object, M extends MethodNames<T>>(
        module: T,
        methodName: M,
        fn: T[M],
        times = Infinity,
    ): void => {
        restore(module, methodName);
        mock.method(module, methodName, fn as any, { times });
    };
    export const restore = <T extends object, M extends MethodNames<T>>(
        module: T,
        methodName: M,
    ) => {
        const mocker = (module[methodName] as any)["mock"];
        if (mocker == undefined) return;
        mocker["restore"]();
    };

    export const init = () => {
        implement(
            Oauth.Kakao,
            "getUrlForLogin",
            () => "http://localhost:4000/login",
        );

        implement(
            Oauth.Github,
            "getUrlForLogin",
            () => "http://localhost:4000/login",
        );

        implement(Oauth.Github, "getProfile", async (code) => {
            if (code === "test_fail")
                return Result.Error.map(
                    new Failure.Internal<ErrorCode.Authentication>(
                        "AUTHENTICATION_FAIL",
                    ),
                );
            return Result.Ok.map({
                oauth_sub: code,
                profile: { ...typia.random<IOauth.IProfile>(), name: code },
            });
        });

        implement(Oauth.Kakao, "getProfile", async (code) => {
            if (code === "test_fail")
                return Result.Error.map(
                    new Failure.Internal<ErrorCode.Authentication>(
                        "AUTHENTICATION_FAIL",
                    ),
                );
            return Result.Ok.map({
                oauth_sub: code,
                profile: { ...typia.random<IOauth.IProfile>(), name: code },
            });
        });
    };
}
