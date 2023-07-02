import { HttpError } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import assert from "assert";

export const test_failure =
    <T = void>(api: (input: T) => Promise<unknown>) =>
    (expected: { status: HttpStatus; message: string }) =>
    async (input: T) => {
        try {
            await api(input);
            throw Error("Unexpected Success!");
        } catch (error) {
            if (!(error instanceof HttpError)) {
                throw error;
            }
            const actual = { status: error.status, message: error.message };
            assert.deepStrictEqual(actual, expected);
        }
    };
