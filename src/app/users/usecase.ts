import { Exception } from "@SRC/common/exception";
import { Result } from "@SRC/common/result";
import { Regex } from "@SRC/common/type";

import { User } from "./domain";
import { IUser } from "./dto";

export namespace UsersUsecase {
    export const get = async (user_id: Regex.UUID): Promise<Result<IUser, Exception.User.NotFound>> => {
        const user = await User.get()({ id: user_id });
        return user;
    };
}
