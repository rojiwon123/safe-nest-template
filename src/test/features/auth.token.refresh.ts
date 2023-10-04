/**
import api from "@project/api";
import { HttpStatus } from "@nestjs/common";
import typia from "typia";

import { ErrorCode } from "@APP/types/ErrorCode";
import { IAuthentication } from "@APP/types/IAuthentication";

import { ITestFn } from "../internal/type";
import { Util } from "../internal/utils";

Util.md.title(__filename);

const test = api.functional.auth.token.refresh;

export const test_token_refresh: ITestFn = async (connection) => {
    const response = await test(connection, { refresh_token: "" });
    Util.assertResposne({
        status: HttpStatus.CREATED,
        success: true,
        assertBody:
            typia.createAssertEquals<IAuthentication.IRefreshResponse>(),
    })(response);
    // 토큰 검증 확인
};

export const test_expired_token: ITestFn = async (connection) => {
    const response = await test(connection, { refresh_token: "" });
    Util.assertResposne({
        status: HttpStatus.FORBIDDEN,
        success: false,
        assertBody: typia.createAssertEquals<ErrorCode.Token.Expired>(),
    })(response);
};

export const test_invalid_token: ITestFn = async (connection) => {
    const response = await test(connection, { refresh_token: "" });
    Util.assertResposne({
        status: HttpStatus.FORBIDDEN,
        success: false,
        assertBody: typia.createAssertEquals<ErrorCode.Token.Invalid>(),
    })(response);
};
*/
