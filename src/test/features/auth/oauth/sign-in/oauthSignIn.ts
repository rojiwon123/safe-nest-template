import api from "@PROJECT/api";
import { ArrayUtil } from "@nestia/e2e";
import { HttpStatus } from "@nestjs/common";
import typia from "typia";

import { ITestFn } from "@APP/test/internal/type";
import { Util } from "@APP/test/internal/utils";
import { ErrorCode } from "@APP/types/dto/ErrorCode";
import { IAuthentication } from "@APP/types/dto/IAuthentication";

Util.md.ToggleStart("auth.oauth.sign-in.oauthSignIn");

const oauths = ["github", "kakao"] as const;
const oauthSignIn = api.functional.auth.oauth.sign_in.oauthSignIn;

export const test_signIn_by_oauth: ITestFn = (connection) =>
    ArrayUtil.asyncForEach(oauths)(async (oauth_type) => {
        const response = await oauthSignIn(connection, {
            oauth_type,
            code: "test",
        });
        Util.assertResposne({
            status: HttpStatus.OK,
            success: true,
            assertBody:
                typia.createAssertEquals<IAuthentication.ISignInResponse>(),
        })(response);
    });

export const test_oauth_fail: ITestFn = (connection) =>
    ArrayUtil.asyncForEach(oauths)(async (oauth_type) => {
        const response = await oauthSignIn(connection, {
            oauth_type,
            code: "test_fail",
        });
        Util.assertResposne({
            status: HttpStatus.UNAUTHORIZED,
            success: false,
            assertBody: typia.createAssertEquals<ErrorCode.Authentication>(),
        })(response);
    });

export const test_user_not_found: ITestFn = async (connection) => {
    const response = await oauthSignIn(connection, {
        oauth_type: "github",
        code: "",
    });
    Util.assertResposne({
        status: HttpStatus.FORBIDDEN,
        success: false,
        assertBody: typia.createAssertEquals<ErrorCode.User.NotFound>(),
    })(response);
};
