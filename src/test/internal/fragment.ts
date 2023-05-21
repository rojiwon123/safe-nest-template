import { HttpError } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import assert from "assert";

export const test_error =
  <T = void>(api: (input: T) => Promise<unknown>) =>
  (statusCode: HttpStatus, message: string) =>
  async (input: T) => {
    try {
      await api(input);
      throw Error("Unexpected Success!");
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }
      assert.deepStrictEqual(
        { status: error.status, message: error.message },
        {
          status: statusCode,
          message
        }
      );
    }
  };
