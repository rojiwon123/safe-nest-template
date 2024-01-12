import typia from "typia";

import { ErrorCode } from "@APP/types/ErrorCode";
import { IUser } from "@APP/types/IUser";
import { Regex } from "@APP/types/common";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace User {
    export const get =
        () =>
        async (input: {
            id: Regex.UUID;
        }): Promise<Result<IUser, Failure<ErrorCode.User.NotFound>>> => {
            return Result.Ok.map({ ...typia.random<IUser>(), id: input.id });
        };
}
