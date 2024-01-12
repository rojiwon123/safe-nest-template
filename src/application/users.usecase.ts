import { User } from "@APP/domain/user";
import { ErrorCode } from "@APP/types/ErrorCode";
import { IUser } from "@APP/types/IUser";
import { Regex } from "@APP/types/common";
import { Failure } from "@APP/utils/failure";
import { Result } from "@APP/utils/result";

export namespace UsersUsecase {
    export const get = async (
        user_id: Regex.UUID,
    ): Promise<Result<IUser, Failure<ErrorCode.User.NotFound>>> => {
        const user = await User.get()({ id: user_id });
        return user;
    };
}
