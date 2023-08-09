import { HttpError } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import assert from "assert";
import typia from "typia";

import { IFailure } from "@APP/api/types";

export const test_failure =
    <T = void>(api: (input: T) => Promise<unknown>) =>
    (status: HttpStatus, expected: IFailure) =>
    async (input: T) => {
        try {
            await api(input);
            throw Error("Unexpected Success!");
        } catch (error) {
            if (!(error instanceof HttpError)) {
                throw error;
            }
            assert.strictEqual(error.status, status);
            assert.deepStrictEqual(
                typia.assertParse<IFailure>(error.message),
                expected,
            );
        }
    };
