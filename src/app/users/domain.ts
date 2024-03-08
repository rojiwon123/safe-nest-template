import typia from 'typia';

import { ErrorCode } from '@SRC/common/error_code';
import { Regex } from '@SRC/common/type';
import { Result } from '@SRC/utils/result';

import { IUser } from './dto';

export namespace User {
    export const get =
        () =>
        async (input: {
            id: Regex.UUID;
        }): Promise<Result<IUser, ErrorCode.User.NotFound>> => {
            return Result.Ok.map({ ...typia.random<IUser>(), id: input.id });
        };
}
