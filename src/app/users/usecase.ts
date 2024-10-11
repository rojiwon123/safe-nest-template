import typia from "typia";

import { Exception } from "@SRC/util/exception";
import { Result } from "@SRC/util/result";

import { UserDTO } from "./application/user.dto";
import { User } from "./domain/user.interface";

export namespace UserUsecase {
    export const getProfile = async (input: User.Id): Promise<Result<UserDTO.Profile, Exception.User.NotFound>> => {
        return Result.Ok({ ...typia.random<UserDTO.Profile>(), id: input.user_id });
    };
}
