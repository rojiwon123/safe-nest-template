import { IFailure } from "@APP/api/types";
import { HttpError } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import assert from "assert";
import typia from "typia";

export const test_failure =
    <T = void>(api: (input: T) => Promise<unknown>) =>
    (expected: { status: HttpStatus; code: string; message: string }) =>
    async (input: T) => {
        try {
            await api(input);
            throw Error("Unexpected Success!");
        } catch (error) {
            if (!(error instanceof HttpError)) {
                throw error;
            }
            const { code, message } = typia.assertParse<IFailure>(
                error.message,
            );
            const actual = { status: error.status, code, message };
            assert.deepStrictEqual(actual, expected);
        }
    };
