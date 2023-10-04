import { ArrayUtil } from "@nestia/e2e";
import { HttpStatus } from "@nestjs/common";
import api from "@project/api";
import typia from "typia";

import { ITestFn } from "@APP/test/internal/type";
import { Util } from "@APP/test/internal/utils";
import { ErrorCode } from "@APP/types/ErrorCode";

Util.md.title(__filename);

const oauths = ["github", "kakao"] as const;
const oauthSignUp = api.functional.auth.oauth.sign_up.oauthSignUp;

/**
export const test_signUp_by_oauth: ITestFn = (connection) =>
    ArrayUtil.asyncForEach(oauths)(async (oauth_type) => {
        const response = await oauthSignUp(connection, {
            oauth_type,
            code: "test",
        });
        Util.assertResposne({
            status: HttpStatus.CREATED,
            success: true,
            assertBody:
                typia.createAssertEquals<IAuthentication.ISignInResponse>(),
        })(response);
    });
*/

export const test_oauth_fail: ITestFn = (connection) =>
    ArrayUtil.asyncForEach(oauths)(async (oauth_type) => {
        const response = await oauthSignUp(connection, {
            oauth_type,
            code: "test_fail",
        });
        Util.assertResposne({
            status: HttpStatus.UNAUTHORIZED,
            success: false,
            assertBody: typia.createAssertEquals<ErrorCode.Authentication>(),
        })(response);
    });

export const test_user_already_exist: ITestFn = async (connection) => {
    const response = await oauthSignUp(connection, {
        oauth_type: "github",
        code: "",
    });
    Util.assertResposne({
        status: HttpStatus.FORBIDDEN,
        success: false,
        assertBody: typia.createAssertEquals<ErrorCode.User.AlreadyExist>(),
    })(response);
};
