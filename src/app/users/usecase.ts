import { ErrorCode } from '@SRC/common/error_code';
import { Regex } from '@SRC/common/type';
import { Result } from '@SRC/utils/result';

import { User } from './domain';
import { IUser } from './dto';

export namespace UsersUsecase {
    export const get = async (
        user_id: Regex.UUID,
    ): Promise<Result<IUser, ErrorCode.User.NotFound>> => {
        const user = await User.get()({ id: user_id });
        return user;
    };
}
