import typia from "typia";

import { Exception } from "@SRC/common/exception";
import { Result } from "@SRC/common/result";
import { Regex } from "@SRC/common/type";

import { IUser } from "./dto";

export namespace User {
    export const get =
        () =>
        async (input: { id: Regex.UUID }): Promise<Result<IUser, Exception.User.NotFound>> =>
            Result.Ok({ ...typia.random<IUser>(), id: input.id });
}
